const nodemailer = require('nodemailer');

function createZohoTransporter() {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASSWORD;
  if (!user || !pass) {
    throw new Error('Zoho SMTP is not configured. Set ZOHO_SMTP_USER and ZOHO_SMTP_PASSWORD.');
  }

  const port = Number(process.env.ZOHO_SMTP_PORT || 465);
  return {
    user,
    transporter: nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || 'smtppro.zoho.com',
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    }),
  };
}

async function sendZohoMail(message) {
  const { user, transporter } = createZohoTransporter();
  const from = message.from || `Cervejando com Diego <${user}>`;
  return transporter.sendMail({ ...message, from });
}

module.exports = { sendZohoMail };
