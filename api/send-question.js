import zohoMailer from './zoho-mailer.js';

const { sendZohoMail } = zohoMailer;
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function clean(value,max){ return String(value || '').trim().slice(0,max); }

export default async function handler(req,res){
  if(req.method!=='POST'){ res.setHeader('Allow','POST'); return res.status(405).json({error:'Método não permitido.'}); }

  const name=clean(req.body?.name,80);
  const email=clean(req.body?.email,160);
  const question=clean(req.body?.question,2000);
  const website=clean(req.body?.website,200);

  if(website) return res.status(200).json({ok:true});
  if(!name) return res.status(400).json({error:'Informe seu nome.'});
  if(!email) return res.status(400).json({error:'Informe seu e-mail.'});
  if(!EMAIL_RE.test(email)) return res.status(400).json({error:'Informe um e-mail válido.'});
  if(!question) return res.status(400).json({error:'Escreva sua pergunta.'});

  const safeName=name.replace(/[<>&"]/g,'');
  const safeEmail=email.replace(/[<>&"]/g,'');
  const safeQuestion=question.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');

  try{
    await sendZohoMail({
      from: process.env.QUESTION_FROM_EMAIL,
      to: process.env.QUESTION_TO_EMAIL || 'contato@cervejandocomdiego.com.br',
      replyTo: email,
      subject: `Nova pergunta no site — ${name}`,
      html:`<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1b1b1b"><h2>Nova pergunta pelo Cervejando com Diego 🍻</h2><p><strong>Nome:</strong> ${safeName}</p><p><strong>E-mail:</strong> ${safeEmail}</p><p><strong>Pergunta:</strong></p><div style="padding:16px;border-left:4px solid #c99732;background:#f7f4ee;line-height:1.6">${safeQuestion}</div><p style="margin-top:22px;color:#666;font-size:13px">Para responder ao cliente, basta clicar em “Responder” neste e-mail.</p></div>`,
      text:`Nova pergunta pelo Cervejando com Diego\n\nNome: ${name}\nE-mail: ${email}\n\nPergunta:\n${question}\n\nPara responder ao cliente, basta responder este e-mail.`
    });
    return res.status(200).json({ok:true});
  }catch(error){
    console.error('Erro ao enviar pergunta pelo Zoho:',error);
    return res.status(500).json({error:'Não foi possível enviar sua pergunta agora.'});
  }
}
