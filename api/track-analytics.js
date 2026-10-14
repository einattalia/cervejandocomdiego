const { createClient } = require('@supabase/supabase-js');

const ALLOWED_EVENTS = new Set(['page_view', 'product_view', 'add_to_cart', 'begin_checkout', 'purchase']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clean = (value, max = 120) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max) : '';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host && new URL(origin).host !== host) { res.statusCode = 403; return res.end('Origin not allowed'); }
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { res.statusCode = 503; return res.end('Analytics not configured'); }
  const body = req.body || {};
  if (!ALLOWED_EVENTS.has(body.event_name) || !UUID.test(body.event_id || '') || !UUID.test(body.visitor_id || '') || !UUID.test(body.session_id || '')) {
    res.statusCode = 400; return res.end('Invalid analytics event');
  }
  const referrerHost = (() => { try { return body.referrer ? new URL(body.referrer).hostname.replace(/^www\./, '') : ''; } catch { return ''; } })();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { error } = await supabase.from('analytics_events').insert({
    event_id: body.event_id,
    event_name: body.event_name,
    visitor_id: body.visitor_id,
    session_id: body.session_id,
    page_path: clean(body.page_path, 180) || '/',
    traffic_source: clean(body.traffic_source, 120) || referrerHost || '(direto)',
    traffic_medium: clean(body.traffic_medium, 80) || (referrerHost ? 'referral' : '(nenhum)'),
    traffic_campaign: clean(body.traffic_campaign, 120) || null,
    product_slug: clean(body.product_slug, 100) || null,
    product_name: clean(body.product_name, 120) || null
  });
  if (error && error.code !== '23505') { console.error('Analytics insert failed', error); res.statusCode = 500; return res.end('Could not record event'); }
  res.statusCode = 204;
  res.end();
};
