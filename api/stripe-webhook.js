const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function sendGa4Purchase(order, items) {
  const { GA4_MEASUREMENT_ID, GA4_API_SECRET } = process.env;
  if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET || !order.ga_client_id) return;
  const params = new URLSearchParams({ measurement_id: GA4_MEASUREMENT_ID, api_secret: GA4_API_SECRET });
  const delivery = Number(order.delivery_fee) || 0;
  const body = {
    client_id: order.ga_client_id,
    events: [{
      name: 'purchase',
      params: {
        transaction_id: order.order_code,
        currency: 'BRL',
        value: Math.max(0, Number(order.total) - delivery),
        shipping: delivery,
        items: items.map(item => ({
          item_id: item.beer_slug,
          item_name: item.beer_name_snapshot,
          item_category: item.item_type === 'kit' ? 'Kit' : 'Cerveja',
          price: Number(item.unit_price) || 0,
          quantity: Number(item.quantity) || 1
        })),
        ...(order.ga_session_id ? { session_id: Number(order.ga_session_id), engagement_time_msec: 1 } : {})
      }
    }]
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`https://www.google-analytics.com/mp/collect?${params}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal
    });
    if (!response.ok) console.warn('GA4 purchase event was not accepted:', response.status);
  } catch (error) {
    console.warn('GA4 purchase event could not be sent:', error.message);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.statusCode = 503; return res.end('Webhook not configured');
  }
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const body = await rawBody(req);
    const event = stripe.webhooks.constructEvent(body, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.payment_status !== 'paid') { res.statusCode = 200; return res.end('Payment not confirmed'); }
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId) {
        const { error } = await supabase.rpc('mark_order_paid', {
          p_order_id: orderId, p_payment_provider: 'stripe', p_payment_reference: session.payment_intent || session.id
        });
        if (error) throw error;
        const { error: modeError } = await supabase.from('orders').update({ stripe_livemode: session.livemode === true }).eq('id', orderId);
        if (modeError) throw modeError;
        const { data: order, error: orderError } = await supabase.from('orders')
          .select('id,order_code,total,delivery_fee,analytics_visitor_id,analytics_session_id,ga_client_id,ga_session_id')
          .eq('id', orderId).maybeSingle();
        if (orderError) throw orderError;
        if (order?.analytics_visitor_id && order?.analytics_session_id) {
          const { error: analyticsError } = await supabase.from('analytics_events').insert({
            event_id: order.id, event_name: 'purchase', visitor_id: order.analytics_visitor_id,
            session_id: order.analytics_session_id, page_path: '/pedido-confirmado',
            traffic_source: '(checkout)', traffic_medium: 'stripe'
          });
          if (analyticsError && analyticsError.code !== '23505') throw analyticsError;
          if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET && order.ga_client_id) {
            const { data: items, error: itemsError } = await supabase.from('order_items')
              .select('item_type,beer_slug,beer_name_snapshot,unit_price,quantity').eq('order_id', order.id);
            if (itemsError) throw itemsError;
            await sendGa4Purchase(order, items || []);
          }
        }
      }
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId) {
        const { error } = await supabase.from('orders').update({ payment_status: 'failed' })
          .eq('id', orderId).neq('payment_status', 'paid');
        if (error) throw error;
      }
    }
    res.statusCode = 200;
    res.end('ok');
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.end(`Webhook Error: ${error.message}`);
  }
};

module.exports.config = { api: { bodyParser: false } };
