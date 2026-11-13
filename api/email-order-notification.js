const { sendZohoMail } = require('./zoho-mailer');

const formatMoney = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function orderSummary(items) {
  return (items || []).map(item => {
    const quantity = Number(item.quantity) || 1;
    const name = String(item.beer_name_snapshot || 'Produto');
    const lines = [`${quantity} × ${name} — ${formatMoney(item.line_total)}`];
    if (item.item_type === 'kit') {
      const components = (Array.isArray(item.components_snapshot) ? item.components_snapshot : []).filter(component => component.beer_id);
      components.forEach(component => lines.push(`  • ${(Number(component.quantity) || 1) * quantity} × ${component.name || 'Cerveja'}`));
    }
    return lines;
  }).flat();
}

async function sendOrderConfirmation(order, items) {
  const lines = orderSummary(items);
  const itemList = lines.length ? lines.join('\n') : 'Itens do seu pedido';
  const htmlItems = lines.length
    ? `<ul>${lines.map(line => `<li>${escapeHtml(line.trim())}</li>`).join('')}</ul>`
    : '<p>Itens do seu pedido</p>';
  const text = [
    `Olá, ${order.customer_name || 'cliente'}!`,
    '',
    `O pagamento do seu pedido ${order.order_code} foi confirmado.`,
    '',
    'Resumo do pedido:',
    itemList,
    '',
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Entrega: ${formatMoney(order.delivery_fee)}`,
    `Total: ${formatMoney(order.total)}`,
    '',
    'Obrigado por comprar com a Cervejando com Diego!',
    'Qualquer dúvida entre em contato comigo pelo WhatsApp: (16) 997927-7171',
  ].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#222"><div style="text-align:center;margin-bottom:24px"><img src="https://www.cervejandocomdiego.com.br/assets/logo-diego-copo-contorno.png?v=1" alt="Cervejando com Diego" style="max-width:240px;width:100%;height:auto" /></div><h2>Pedido confirmado</h2><p>Olá, ${escapeHtml(order.customer_name || 'cliente')}!</p><p>O pagamento do seu pedido <strong>${escapeHtml(order.order_code)}</strong> foi confirmado.</p><h3>Resumo do pedido</h3>${htmlItems}<p>Subtotal: ${formatMoney(order.subtotal)}<br>Entrega: ${formatMoney(order.delivery_fee)}<br><strong>Total: ${formatMoney(order.total)}</strong></p><p>Obrigado por comprar com a Cervejando com Diego!</p><p>Qualquer dúvida entre em contato comigo pelo WhatsApp: <strong>(16) 997927-7171</strong></p></div>`;
  return sendZohoMail({
    to: order.customer_email,
    subject: `Pedido ${order.order_code} confirmado — Cervejando com Diego`,
    text,
    html,
  });
}

module.exports = { sendOrderConfirmation };
