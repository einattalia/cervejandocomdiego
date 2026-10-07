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

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const body = await rawBody(req);
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.payment_status !== 'paid') {
        res.statusCode = 200;
        return res.end('Payment not confirmed');
      }
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId) {
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
        const { error } = await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId).neq('payment_status', 'paid');
        if (error) throw error;
      }
    }

    res.statusCode = 200;
    return res.end('ok');
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    return res.end(`Webhook Error: ${error.message}`);
  }
};

module.exports.config = { api: { bodyParser: false } };
