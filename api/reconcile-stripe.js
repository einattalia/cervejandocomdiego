const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { computeStripeFinancials } = require('./stripe-financials');

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  const isScheduledCall = req.method === 'GET'
    && Boolean(cronSecret)
    && String(req.headers.authorization || '') === `Bearer ${cronSecret}`;
  if (req.method !== 'POST' && !isScheduledCall) {
    return json(res, req.method === 'GET' ? 401 : 405, {
      error: req.method === 'GET' ? 'Agendamento não autorizado.' : 'Método não permitido.',
    });
  }
  const { STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 503, { error: 'Conciliação Stripe não configurada no servidor.' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  if (!isScheduledCall) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) return json(res, 401, { error: 'Faça login para conferir os pagamentos.' });
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) return json(res, 401, { error: 'Sessão administrativa inválida.' });
    const { data: admin, error: adminError } = await supabase.from('admin_users')
      .select('user_id').eq('user_id', authData.user.id).maybeSingle();
    if (adminError) return json(res, 500, { error: 'Não foi possível validar a permissão de administrador.' });
    if (!admin) return json(res, 403, { error: 'Esta conta não pode conferir pagamentos.' });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const liveMode = STRIPE_SECRET_KEY.includes('_live_');
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const recheckBefore = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: orders, error: ordersError } = await supabase.from('orders')
      .select('id,order_code,stripe_checkout_session_id,stripe_livemode,stripe_fee_amount,stripe_net_amount,payment_status,amount_refunded,created_at')
      .not('stripe_checkout_session_id', 'is', null)
      .eq('stripe_livemode', liveMode)
      .gte('created_at', cutoff)
      .or(`stripe_reconciled_at.is.null,stripe_reconciled_at.lt.${recheckBefore}`)
      .order('created_at', { ascending: true }).limit(11);
    if (ordersError) throw ordersError;

    const result = { checked: 0, updated: 0, feesPending: 0, mode: liveMode ? 'live' : 'test', moreToCheck: (orders || []).length > 10, errors: [] };
    const candidates = (orders || []).slice(0, 10);
    for (let offset = 0; offset < candidates.length; offset += 5) {
      await Promise.all(candidates.slice(offset, offset + 5).map(async order => {
      result.checked += 1;
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripe_checkout_session_id, {
          expand: ['payment_intent.latest_charge'],
        });
        const linkedOrderId = session.metadata?.order_id || session.client_reference_id;
        if (linkedOrderId !== order.id) throw new Error('O checkout da Stripe está associado a outro pedido.');

        let changed = false;
        if (session.payment_status === 'paid') {
          const paymentIntent = session.payment_intent;
          const paymentIntentId = typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id;
          const { error: paidError } = await supabase.rpc('mark_order_paid', {
            p_order_id: order.id,
            p_payment_provider: 'stripe',
            p_payment_reference: paymentIntentId || session.id,
          });
          if (paidError) throw paidError;
          if (!['paid', 'partially_refunded', 'refunded'].includes(order.payment_status)) changed = true;

          const financials = await computeStripeFinancials(stripe, session);
          if (financials) {
            const { error: financialsError } = await supabase.from('orders').update({
              stripe_livemode: session.livemode === true,
              ...financials,
              updated_at: new Date().toISOString(),
            }).eq('id', order.id);
            if (financialsError) throw financialsError;
            if (Number(financials.stripe_fee_amount) !== Number(order.stripe_fee_amount)
              || Number(financials.stripe_net_amount) !== Number(order.stripe_net_amount)) changed = true;
          } else {
            result.feesPending += 1;
          }

          let charge = typeof paymentIntent === 'object' ? paymentIntent.latest_charge : null;
          if (typeof charge === 'string') charge = await stripe.charges.retrieve(charge);
          if (charge && typeof charge === 'object') {
            const refunded = Number((Number(charge.amount_refunded || 0) / 100).toFixed(2));
            const fullRefund = Number(charge.amount_refunded || 0) >= Number(charge.amount || 0) && Number(charge.amount || 0) > 0;
            const paymentStatus = refunded <= 0 ? 'paid' : fullRefund ? 'refunded' : 'partially_refunded';
            const { error: refundError } = await supabase.from('orders').update({
              amount_refunded: refunded,
              payment_status: paymentStatus,
              refunded_at: refunded > 0 ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            }).eq('id', order.id);
            if (refundError) throw refundError;
            if (refunded !== Number(order.amount_refunded || 0) || paymentStatus !== order.payment_status) changed = true;
          }
        } else if (session.status === 'expired' && !['paid', 'partially_refunded', 'refunded'].includes(order.payment_status)) {
          const { error: expiredError } = await supabase.from('orders').update({
            payment_status: 'expired', status: 'cancelled', updated_at: new Date().toISOString(),
          }).eq('id', order.id);
          if (expiredError) throw expiredError;
          changed = order.payment_status !== 'expired';
        }

        const { error: stampError } = await supabase.from('orders').update({
          stripe_livemode: session.livemode === true,
          stripe_reconciled_at: new Date().toISOString(), stripe_reconciliation_error: null,
        }).eq('id', order.id);
        if (stampError) throw stampError;
        if (changed) result.updated += 1;
      } catch (error) {
        const rawMessage = String(error.message || error);
        const message = /No such checkout\.session|resource_missing/i.test(rawMessage)
          ? `Checkout ${order.stripe_checkout_session_id} não encontrado nesta conta e ambiente da Stripe. Confirme se a chave configurada no Vercel pertence à mesma conta e modo (teste/produção) que criou a sessão.`
          : rawMessage.slice(0, 300);
        result.errors.push({ order: order.order_code || order.id, message });
        const { error: recordError } = await supabase.from('orders').update({
          stripe_reconciled_at: new Date().toISOString(), stripe_reconciliation_error: message,
        }).eq('id', order.id);
        if (recordError) console.error('Could not record reconciliation error:', recordError);
      }
      }));
    }

    return json(res, 200, result);
  } catch (error) {
    console.error('Stripe reconciliation failed:', error);
    return json(res, 500, { error: 'A conferência não foi concluída. Tente novamente.' });
  }
};
