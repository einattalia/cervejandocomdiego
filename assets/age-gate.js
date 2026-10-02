/* EDITAR: altere apenas os textos abaixo para personalizar a janela.
   A confirmação vale durante esta sessão da aba. */
const AGE_GATE_CONFIG = {
  title: 'Verificação de idade',
  question: 'Para continuar, você confirma ter 18 anos ou mais?',
  yes: 'Sim',
  no: 'Não',
  denied: 'Este site é destinado a pessoas com 18 anos ou mais. O acesso não foi liberado.',
  retry: 'Voltar',
  notice: 'Venda proibida para menores de 18 anos. Beba com moderação.'
};
(() => {
  const gate = document.getElementById('ageGate');
  const title = document.getElementById('ageTitle');
  const question = document.getElementById('ageQuestion');
  const yes = document.getElementById('ageYes');
  const no = document.getElementById('ageNo');
  title.textContent = AGE_GATE_CONFIG.title;
  question.textContent = AGE_GATE_CONFIG.question;
  yes.textContent = AGE_GATE_CONFIG.yes;
  no.textContent = AGE_GATE_CONFIG.no;
  document.getElementById('ageNotice').textContent = AGE_GATE_CONFIG.notice;
  let accepted = false;
  try { accepted = sessionStorage.getItem('diego-age-confirmed-v1') === 'yes'; } catch {}
  if (accepted) {
    gate.hidden = true;
    document.documentElement.classList.remove('age-pending');
    return;
  }
  const background = [...document.body.children].filter(el => el !== gate && !['SCRIPT','STYLE'].includes(el.tagName));
  const previous = background.map(el => [el, el.inert]);
  background.forEach(el => { el.inert = true; });
  let denied = false;
  no.addEventListener('click', () => {
    denied = !denied;
    question.textContent = denied ? AGE_GATE_CONFIG.denied : AGE_GATE_CONFIG.question;
    yes.hidden = denied;
    no.textContent = denied ? AGE_GATE_CONFIG.retry : AGE_GATE_CONFIG.no;
    no.focus();
  });
  yes.addEventListener('click', () => {
    try { sessionStorage.setItem('diego-age-confirmed-v1', 'yes'); } catch {}
    gate.hidden = true;
    document.documentElement.classList.remove('age-pending');
    previous.forEach(([el, inert]) => { el.inert = inert; });
    document.querySelector('header a')?.focus();
  });
  gate.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); }
    if (event.key === 'Tab') {
      const buttons = denied ? [no] : [no, yes];
      const next = event.shiftKey ? buttons[0] : buttons[buttons.length - 1];
      if (document.activeElement === next) {
        event.preventDefault();
        (event.shiftKey ? buttons[buttons.length - 1] : buttons[0]).focus();
      }
    }
  });
  no.focus();
})();