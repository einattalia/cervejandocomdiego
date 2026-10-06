(() => {
'use strict';
const form = document.getElementById('partyForm');
if (!form) return;
const date = form.elements.data;
const phone = form.elements.whatsapp;
const today = () => new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
date.min = today();
phone.addEventListener('input', () => phone.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  date.min = today();
  const digits = phone.value.replace(/\D/g, '');
  const local = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  phone.setCustomValidity(/^[1-9][0-9]9[0-9]{8}$/.test(local) ? '' : 'Informe um celular com DDD e 9 dígitos, por exemplo (16) 99999-9999.');
  ['cidade','local','necessidades','nome'].forEach(name => {form.elements[name].value = form.elements[name].value.trim();});
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const formatted = data.data.split('-').reverse().join('/');
  const message = ['Olá, Diegão! Quero montar meu evento e solicitar um orçamento para a estrutura de chopp.', '', `Tipo: ${data.tipo}`, `Data: ${formatted}`, `Cidade: ${data.cidade}`, `Local: ${data.local}`, `Convidados estimados: ${data.convidados}`, `Duração prevista: ${data.duracao} horas`, `O que preciso: ${data.necessidades}`, `Observações: ${data.observacoes.trim() || 'Nenhuma'}`, '', `Nome: ${data.nome}`, `WhatsApp: ${data.whatsapp}`].join('\n');
  const number = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '5516997927171';
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const link = document.getElementById('partyContinue');
  link.href = url;
  link.hidden = false;
  document.getElementById('partyStatus').textContent = 'Mensagem preparada. Conclua o envio no WhatsApp. Se a nova aba não abriu, use o botão abaixo.';
  window.open(url, '_blank', 'noopener,noreferrer');
});
})();
