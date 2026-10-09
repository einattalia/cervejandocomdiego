const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { sendZohoMail } = require('./zoho-mailer');


function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function orderAddress(order) {
  if (order.delivery_type !== 'delivery') return 'Retirada no local';
  const address = order.delivery_address || {};
  const parts = [
    address.street && `${address.street}, ${address.number || 's/n'}`,
    address.complement,
    address.district,
    [address.city, address.state].filter(Boolean).join('/'),
    address.zip_code || address.cep,
  ].filter(Boolean);
  return `Entrega: ${parts.join(' — ') || 'endereço informado no pedido'}`;
}

async function sendOrderEmailNotice(supabase, orderId) {
  const from = process.env.ORDER_NOTIFICATION_FROM_EMAIL
    || process.env.QUESTION_FROM_EMAIL
    || undefined;
  const to = process.env.ORDER_NOTIFICATION_TO_EMAIL || 'contato@cervejandocomdiego.com.br';
  const [{ data: order, error: orderError }, { data: items, error: itemsError }] = await Promise.all([
    supabase.from('orders')
      .select('id,order_code,customer_name,customer_email,customer_phone,delivery_type,delivery_address,notes,total,paid_at')
      .eq('id', orderId)
      .single(),
    supabase.from('order_items')
      .select('beer_name_snapshot,quantity,unit_price,line_total')
      .eq('order_id', orderId),
  ]);
  if (orderError) throw orderError;
  if (itemsError) throw itemsError;
  if (!order) throw new Error('Paid order not found for email notice.');

  const orderCode = order.order_code || String(order.id);
  const itemRows = (items || []).map(item => {
    const name = escapeHtml(item.beer_name_snapshot || 'Produto');
    const quantity = Number(item.quantity) || 0;
    const lineTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
      .format(Number(item.line_total) || (Number(item.unit_price) || 0) * quantity);
    return `<tr><td style="padding:8px;border-bottom:1px solid #eee">${name}</td><td style="padding:8px;text-align:center;border-bottom:1px solid #eee">${quantity}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee">${lineTotal}</td></tr>`;
  }).join('') || '<tr><td colspan="3" style="padding:8px">Itens do pedido</td></tr>';
  const total = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(Number(order.total) || 0);
  const fulfillment = escapeHtml(orderAddress(order));
  const customerName = escapeHtml(order.customer_name || 'Cliente');
  const customerEmail = escapeHtml(order.customer_email || 'Não informado');
  const customerPhone = escapeHtml(order.customer_phone || 'Não informado');
  const notes = escapeHtml(order.notes || 'Nenhuma');
  const paidAt = order.paid_at
    ? new Date(order.paid_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    : 'Confirmado pelo Stripe';
  const subject = `🍻 Venda confirmada — Pedido ${orderCode}`;
  const textBody = [
    'Nova venda confirmada pelo Stripe.',
    `Pedido: ${orderCode}`,
    `Cliente: ${order.customer_name || 'Cliente'}`,
    `E-mail: ${order.customer_email || 'Não informado'}`,
    `WhatsApp: ${order.customer_phone || 'Não informado'}`,
    '',
    'Itens:',
    ...(items || []).map(item => `- ${item.beer_name_snapshot} x ${item.quantity}`),
    `Total: ${total}`,
    fulfillment,
    `Observações: ${order.notes || 'Nenhuma'}`,
    `Pagamento: confirmado no Stripe (${paidAt})`,
  ].join('\n');

  try {
    await sendZohoMail({
      from,
      to,
      subject,
      text: textBody,
      html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#1b1b1b"><h2>🍻 Venda confirmada!</h2><p><strong>Pedido:</strong> ${escapeHtml(orderCode)}</p><p><strong>Cliente:</strong> ${customerName}<br><strong>E-mail:</strong> ${customerEmail}<br><strong>WhatsApp:</strong> ${customerPhone}</p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qtd.</th><th style="padding:8px;text-align:right">Subtotal</th></tr></thead><tbody>${itemRows}</tbody></table><p style="font-size:18px"><strong>Total pago: ${total}</strong></p><p><strong>${fulfillment}</strong></p><p><strong>Observações:</strong> ${notes}</p><p style="color:#666;font-size:13px">Pagamento confirmado pelo Stripe em ${escapeHtml(paidAt)}.</p></div>`,
      headers: { 'X-Cervejando-Order-ID': String(order.id) },
    });
  } catch (error) {
    console.error('Zoho order email failed:', error.message);
    throw error;
  }
}

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function linkEventToOrder(supabase, eventId, orderId) {
  const { error } = await supabase.from('stripe_webhook_events')
    .update({ order_id: orderId }).eq('event_id', eventId);
  if (error) throw error;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }

  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.statusCode = 503;
    return res.end('Webhook not configured');
  }

  let supabase = null;
  let receivedEventId = null;
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const body = await rawBody(req);
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    receivedEventId = event.id;
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const staleBefore = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { error: staleError } = await supabase.from('stripe_webhook_events').update({
      processing_status: 'failed', error_message: 'Processamento interrompido; reenvie o evento para tentar novamente.',
    }).eq('processing_status', 'processing').lt('received_at', staleBefore);
    if (staleError) throw staleError;

    const { error: claimError } = await supabase.from('stripe_webhook_events').insert({
      event_id: event.id,
      event_type: event.type,
      processing_status: 'processing',
    });
    if (claimError) {
      if (claimError.code !== '23505') throw claimError;
      const { data: prior, error: priorError } = await supabase.from('stripe_webhook_events')
        .select('processing_status').eq('event_id', event.id).maybeSingle();
      if (priorError) throw priorError;
      if (prior?.processing_status === 'processed' || prior?.processing_status === 'ignored') {
        res.statusCode = 200;
        return res.end('Already processed');
      }
      if (prior?.processing_status === 'processing') {
        throw new Error('Evento Stripe já está em processamento; solicitar nova entrega.');
      }
      const { data: retryClaim, error: retryError } = await supabase.from('stripe_webhook_events')
        .update({ processing_status: 'processing', error_message: null, processed_at: null })
        .eq('event_id', event.id).eq('processing_status', 'failed').select('event_id').maybeSingle();
      if (retryError) throw retryError;
      if (!retryClaim) throw new Error('Não foi possível reservar o reprocessamento do evento Stripe.');
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.payment_status !== 'paid') {
        const { error } = await supabase.from('stripe_webhook_events').update({
          processing_status: 'ignored', processed_at: new Date().toISOString(),
          error_message: 'Checkout concluído sem confirmação de pagamento.',
        }).eq('event_id', event.id);
        if (error) throw error;
        res.statusCode = 200;
        return res.end('Payment not confirmed');
      }
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId) {
        await linkEventToOrder(supabase, event.id, orderId);
        const { error } = await supabase.rpc('mark_order_paid', {
          p_order_id: orderId,
          p_payment_provider: 'stripe',
          p_payment_reference: session.payment_intent || session.id,
        });
        if (error) throw error;
        await sendOrderEmailNotice(supabase, orderId);
      }
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId) {
        await linkEventToOrder(supabase, event.id, orderId);
        const { error } = await supabase.from('orders').update({ payment_status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', orderId).not('payment_status', 'in', '(paid,partially_refunded,refunded)');
        if (error) throw error;
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId) {
        await linkEventToOrder(supabase, event.id, orderId);
        const { error } = await supabase.from('orders').update({
          payment_status: 'expired', status: 'cancelled', updated_at: new Date().toISOString(),
        }).eq('id', orderId).not('payment_status', 'in', '(paid,partially_refunded,refunded)');
        if (error) throw error;
      }
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      if (paymentIntentId) {
        const { data: order, error: orderError } = await supabase.from('orders')
          .select('id,total').eq('payment_reference', paymentIntentId).maybeSingle();
        if (orderError) throw orderError;
        if (!order) throw new Error(`Estorno Stripe sem pedido correspondente para PaymentIntent ${paymentIntentId}.`);
        await linkEventToOrder(supabase, event.id, order.id);
        const refunded = Number((Number(charge.amount_refunded || 0) / 100).toFixed(2));
        const fullyRefunded = Number(charge.amount_refunded || 0) >= Number(charge.amount || 0);
        const { error } = await supabase.from('orders').update({
          amount_refunded: refunded,
          payment_status: fullyRefunded ? 'refunded' : 'partially_refunded',
          refunded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('id', order.id);
        if (error) throw error;
      }
    }

    const handledTypes = [
      'checkout.session.completed', 'checkout.session.async_payment_succeeded',
      'checkout.session.async_payment_failed', 'checkout.session.expired', 'charge.refunded',
    ];
    const { error: finishError } = await supabase.from('stripe_webhook_events').update({
      processing_status: handledTypes.includes(event.type) ? 'processed' : 'ignored',
      processed_at: new Date().toISOString(), error_message: null,
    }).eq('event_id', event.id);
    if (finishError) throw finishError;

    res.statusCode = 200;
    return res.end('ok');
  } catch (error) {
    console.error(error);
    if (supabase && receivedEventId) {
      try {
        await supabase.from('stripe_webhook_events').update({
          processing_status: 'failed', error_message: String(error.message || error).slice(0, 1000),
        }).eq('event_id', receivedEventId);
      } catch (logError) {
        console.error('Could not record Stripe webhook failure:', logError);
      }
    }
    res.statusCode = 500;
    return res.end(`Webhook Error: ${error.message}`);
  }
};

module.exports.config = { api: { bodyParser: false } };
