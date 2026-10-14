module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end('window.CERVEJANDO_GA4_ID="";');
  }
  const id = /^[Gg]-[A-Z0-9]+$/.test(process.env.GA4_MEASUREMENT_ID || '') ? process.env.GA4_MEASUREMENT_ID : '';
  res.statusCode = 200;
  res.end(`window.CERVEJANDO_GA4_ID=${JSON.stringify(id)};`);
};
