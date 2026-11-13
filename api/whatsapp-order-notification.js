function getWhatsAppConfig() {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ORDER_TEMPLATE_NAME } = process.env;
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ORDER_TEMPLATE_NAME) {
    throw new Error('WhatsApp Cloud API is not configured.');
  }
  return {
    token: WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
    templateName: WHATSAPP_ORDER_TEMPLATE_NAME,
    apiVersion: process.env.WHATSAPP_GRAPH_API_VERSION || 'v27.0',
    language: process.env.WHATSAPP_ORDER_TEMPLATE_LANGUAGE || 'pt_BR',
  };
}

function whatsappNumber(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if (digits.length >= 12 && digits.length <= 15) return digits;
  throw new Error('Customer WhatsApp number is invalid.');
}

function orderBeerList(items) {
  const quantities = new Map();
  for (const item of items || []) {
    const lineQuantity = Number(item.quantity) || 1;
    if (item.item_type === 'kit') {
      const beerComponents = (Array.isArray(item.components_snapshot) ? item.components_snapshot : []).filter(component => component.beer_id);
      for (const component of beerComponents) {
        const name = String(component.name || 'Cerveja');
        quantities.set(name, (quantities.get(name) || 0) + (Number(component.quantity) || 1) * lineQuantity);
      }
      if (!beerComponents.length) {
        const name = `Kit ${item.beer_name_snapshot || ''}`.trim();
        quantities.set(name, (quantities.get(name) || 0) + lineQuantity);
      }
    } else {
      const name = String(item.beer_name_snapshot || 'Cerveja');
      quantities.set(name, (quantities.get(name) || 0) + lineQuantity);
    }
  }
  const lines = [...quantities].map(([name, quantity]) => `${quantity} × ${name}`);
  const list = lines.slice(0, 8).join('\n');
  return (lines.length > 8 ? `${list}\n+ ${lines.length - 8} outro(s) item(ns)` : list).slice(0, 900);
}

async function sendOrderConfirmation(order, items) {
  const config = getWhatsAppConfig();
  const parameters = [
    String(order.customer_name || 'cliente').slice(0, 120),
    String(order.order_code || order.id).slice(0, 80),
    orderBeerList(items) || 'Itens do seu pedido',
  ].map(text => ({ type: 'text', text }));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: whatsappNumber(order.customer_phone),
        type: 'template',
        template: {
          name: config.templateName,
          language: { code: config.language },
          components: [{ type: 'body', parameters }],
        },
      }),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.messages?.[0]?.id) {
      throw new Error(`WhatsApp Cloud API rejected the order notification (${response.status}).`);
    }
    return result.messages[0].id;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { sendOrderConfirmation };
