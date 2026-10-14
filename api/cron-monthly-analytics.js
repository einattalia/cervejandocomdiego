const { timingSafeEqual } = require('node:crypto');
const { createClient } = require('@supabase/supabase-js');

function monthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

function shiftMonth(value, offset) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return monthKey(date.getUTCFullYear(), date.getUTCMonth());
}

function startInstant(month) {
  return new Date(`${month}-01T00:00:00-03:00`).toISOString();
}

function monthRange(month) {
  return { start: startInstant(month), end: startInstant(shiftMonth(month, 1)) };
}

function recommendations(current, previous) {
  const tips = [];
  const visits = Number(current.visits) || 0;
  const previousVisits = Number(previous.visits) || 0;
  const conversion = Number(current.conversion_rate) || 0;
  const previousConversion = Number(previous.conversion_rate) || 0;
  const abandoned = Number(current.abandoned_carts) || 0;
  if (visits > previousVisits && conversion < previousConversion) {
    tips.push('As visitas cresceram, mas a conversão caiu. Revise preço, frete, disponibilidade e etapas do checkout.');
  }
  if (abandoned > 0) tips.push(`${abandoned} carrinho(s) ficaram sem compra confirmada. Investigue possíveis obstáculos no frete e no pagamento.`);
  if (visits > 0 && Number(current.paid_orders) === 0) tips.push('Houve visitas, mas nenhum pagamento confirmado. Confira o fluxo de compra e a disponibilidade dos produtos.');
  const top = current.top_products?.[0];
  if (top) tips.push(`${top.name || 'Um produto'} foi o item mais visto. Compare esse interesse com os pedidos para decidir se vale dar destaque a ele.`);
  if (!tips.length) tips.push('Ainda há poucos sinais para recomendar mudanças. Continue acompanhando visitas, conversão e vendas mês a mês.');
  return tips;
}

function secretMatches(received, expected) {
  if (!received || !expected) return false;
  const provided = Buffer.from(received);
  const configured = Buffer.from(`Bearer ${expected}`);
  return provided.length === configured.length && timingSafeEqual(provided, configured);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
  const { CRON_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!CRON_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { res.statusCode = 503; return res.end('Monthly analytics is not configured'); }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    if (req.method === 'GET') {
      if (!secretMatches(req.headers.authorization, CRON_SECRET)) { res.statusCode = 401; return res.end('Unauthorized'); }
    } else {
      const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
      if (!token) { res.statusCode = 401; return res.end('Faça login como administrador.'); }
      const { data: authData, error: authError } = await supabase.auth.getUser(token);
      if (authError || !authData?.user) { res.statusCode = 401; return res.end('Sessão administrativa inválida.'); }
      const { data: admin, error: adminError } = await supabase.from('admin_users')
        .select('user_id').eq('user_id', authData.user.id).maybeSingle();
      if (adminError) throw adminError;
      if (!admin) { res.statusCode = 403; return res.end('Apenas administradores podem gerar relatórios.'); }
    }
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit'
    }).formatToParts(new Date());
    const year = Number(parts.find(part => part.type === 'year').value);
    const month = Number(parts.find(part => part.type === 'month').value);
    const currentMonth = monthKey(year, month - 1);
    const latestCompletedMonth = shiftMonth(currentMonth, -1);
    const requestedMonth = req.body?.month;
    if (req.method === 'POST' && requestedMonth && !/^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth)) { res.statusCode = 400; return res.end('Mês inválido.'); }
    const reportMonth = req.method === 'POST' && requestedMonth ? requestedMonth : latestCompletedMonth;
    if (req.method === 'POST' && reportMonth >= currentMonth) { res.statusCode = 400; return res.end('Escolha um mês que já terminou.'); }
    const previousMonth = shiftMonth(reportMonth, -1);
    const currentRange = monthRange(reportMonth);
    const previousRange = monthRange(previousMonth);
    const [currentResult, previousResult] = await Promise.all([
      supabase.rpc('get_admin_analytics', { p_start: currentRange.start, p_end: currentRange.end }),
      supabase.rpc('get_admin_analytics', { p_start: previousRange.start, p_end: previousRange.end })
    ]);
    if (currentResult.error) throw currentResult.error;
    if (previousResult.error) throw previousResult.error;
    const currentData = currentResult.data;
    const previousData = previousResult.data;
    const [reportYear, reportMonthNumber] = reportMonth.split('-').map(Number);
    const periodEnd = new Date(Date.UTC(reportYear, reportMonthNumber, 0)).toISOString().slice(0, 10);
    const { error } = await supabase.from('analytics_monthly_reports').upsert({
      report_month: `${reportMonth}-01`,
      period_end: periodEnd,
      current_data: currentData,
      previous_data: previousData,
      recommendations: recommendations(currentData, previousData),
      generated_at: new Date().toISOString()
    }, { onConflict: 'report_month' });
    if (error) throw error;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ ok: true, report_month: reportMonth, generated_at: new Date().toISOString() }));
  } catch (error) {
    console.error('Monthly analytics generation failed:', error);
    res.statusCode = 500;
    return res.end('Could not generate monthly analytics');
  }
};
