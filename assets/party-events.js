(() => {
'use strict';
const form = document.getElementById('partyForm');
if (!form) return;
const date = form.elements.data;
const phone = form.elements.whatsapp;
const drinkersInput = form.elements.pessoas_chopp;
const otherDrinksInput = form.elements.outras_bebidas;
const defaults = {
  liters_per_person_hour: {moderado: 0.25, medio: 0.375, alto: 0.5},
  other_drinks_reduction_percent: 20,
  estimate_range_percent: 10,
  cup_volume_ml: 300
};
let calculatorSettings = JSON.parse(JSON.stringify(defaults));
let lastEstimate = null;
const today = () => new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const formatNumber = value => new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(value);
date.min = today();
phone.addEventListener('input', () => phone.setCustomValidity(''));

function updateEstimate() {
  const guests = Number(form.elements.convidados.value);
  const duration = Number(form.elements.duracao.value);
  const drinkers = drinkersInput.value === '' ? guests : Number(drinkersInput.value);
  const countError = drinkersInput.value !== '' && drinkers > guests;
  drinkersInput.setCustomValidity(countError ? 'O número de pessoas que beberão chopp não pode ser maior que o total de convidados.' : '');
  const litersLabel = document.getElementById('partyCalcLiters');
  const cupsLabel = document.getElementById('partyCalcCups');
  if (!Number.isFinite(guests) || guests < 1 || !Number.isFinite(duration) || duration <= 0 || countError) {
    lastEstimate = null;
    litersLabel.textContent = countError ? 'Confira a quantidade de pessoas' : 'Preencha convidados e duração';
    cupsLabel.textContent = countError ? 'Pessoas que beberão chopp não pode superar o total de convidados.' : 'A estimativa será atualizada conforme você preenche.';
    return null;
  }
  const profile = form.elements.perfil_consumo.value || 'medio';
  const rate = Number(calculatorSettings.liters_per_person_hour?.[profile]) || defaults.liters_per_person_hour[profile] || defaults.liters_per_person_hour.medio;
  let base = drinkers * duration * rate;
  if (otherDrinksInput.checked) base *= 1 - Math.min(80, Math.max(0, Number(calculatorSettings.other_drinks_reduction_percent) || 0)) / 100;
  const variation = Math.min(50, Math.max(0, Number(calculatorSettings.estimate_range_percent) || 0)) / 100;
  const low = Math.max(0, base * (1 - variation));
  const high = base * (1 + variation);
  const cupMl = Math.max(100, Math.min(1000, Number(calculatorSettings.cup_volume_ml) || defaults.cup_volume_ml));
  const cupsLow = Math.floor(low * 1000 / cupMl);
  const cupsHigh = Math.ceil(high * 1000 / cupMl);
  lastEstimate = {low, high, cupsLow, cupsHigh, drinkers, rate, cupMl, profile, otherDrinks:otherDrinksInput.checked};
  litersLabel.textContent = `Estimativa: ${formatNumber(low)} a ${formatNumber(high)} litros`;
  cupsLabel.textContent = `Cerca de ${cupsLow} a ${cupsHigh} copos de ${formatNumber(cupMl)} ml`;
  return lastEstimate;
}

async function loadCalculatorSettings() {
  try {
    const response = await fetch('https://cqtdrpwnjnetbcnuqtyv.supabase.co/rest/v1/party_event_content?select=calculator_settings&limit=1', {
      headers: {apikey:'sb_publishable_hY5y6tve470_iBtkQuQiLw_Vs38_nBy',Accept:'application/json'}, cache:'no-store'
    });
    if (!response.ok) throw new Error('Configuração da calculadora indisponível');
    const rows = await response.json();
    const saved = rows?.[0]?.calculator_settings;
    if (saved && typeof saved === 'object') calculatorSettings = {
      liters_per_person_hour: {...defaults.liters_per_person_hour,...(saved.liters_per_person_hour||{})},
      other_drinks_reduction_percent: saved.other_drinks_reduction_percent ?? defaults.other_drinks_reduction_percent,
      estimate_range_percent: saved.estimate_range_percent ?? defaults.estimate_range_percent,
      cup_volume_ml: saved.cup_volume_ml ?? defaults.cup_volume_ml
    };
  } catch (error) {
    console.warn('Usando os valores padrão da calculadora de chopp.', error);
  }
  updateEstimate();
}

['input','change'].forEach(type => form.addEventListener(type, event => {
  if (['convidados','duracao','pessoas_chopp','perfil_consumo','outras_bebidas'].includes(event.target.name)) updateEstimate();
}));
loadCalculatorSettings();

form.addEventListener('submit', event => {
  event.preventDefault();
  date.min = today();
  const digits = phone.value.replace(/\D/g, '');
  const local = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  phone.setCustomValidity(/^[1-9][0-9]9[0-9]{8}$/.test(local) ? '' : 'Informe um celular com DDD e 9 dígitos, por exemplo (16) 99999-9999.');
  ['cidade','local','necessidades','nome'].forEach(name => {form.elements[name].value = form.elements[name].value.trim();});
  const estimate = updateEstimate();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const formatted = data.data.split('-').reverse().join('/');
  const profileName = {moderado:'Moderado',medio:'Médio',alto:'Alto'}[data.perfil_consumo] || 'Médio';
  const message = [
    'Olá, Diegão! Quero montar meu evento e solicitar um orçamento para a estrutura de chopp.', '',
    `Tipo: ${data.tipo}`, `Data: ${formatted}`, `Cidade: ${data.cidade}`, `Local: ${data.local}`,
    `Convidados estimados: ${data.convidados}`,
    `Pessoas que devem beber chopp: ${estimate.drinkers}`,
    `Duração prevista: ${data.duracao} horas`,
    `Perfil de consumo: ${profileName}`,
    `Outras bebidas alcoólicas: ${estimate.otherDrinks ? 'Sim' : 'Não'}`,
    `Estimativa automática de chopp: ${formatNumber(estimate.low)} a ${formatNumber(estimate.high)} litros (aprox. ${estimate.cupsLow} a ${estimate.cupsHigh} copos de ${formatNumber(estimate.cupMl)} ml)`,
    `O que preciso: ${data.necessidades}`, `Observações: ${data.observacoes.trim() || 'Nenhuma'}`, '',
    `Nome: ${data.nome}`, `WhatsApp: ${data.whatsapp}`
  ].join('\n');
  const number = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '5516997927171';
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const link = document.getElementById('partyContinue');
  link.href = url;
  link.hidden = false;
  document.getElementById('partyStatus').textContent = 'Mensagem preparada. Conclua o envio no WhatsApp. Se a nova aba não abriu, use o botão abaixo.';
  window.open(url, '_blank', 'noopener,noreferrer');
});
})();
