(()=>{
  const fridge=document.querySelector('.premium-fridge');
  const door=fridge?.querySelector('.fridge-door');
  if(!fridge||!door||door.querySelector('.p3-door-panel')) return;
  const panel=document.createElement('div');
  panel.className='p3-door-panel';
  panel.innerHTML='<div class="p3-door-content"><span class="p3-door-kicker">Seleção do Diegão</span><h2 class="p3-door-title">Abre a geladeira.</h2><p class="p3-door-copy">Quatro rótulos escolhidos para você começar a beber diferente.</p><button class="p3-open-fridge" type="button">Abrir a geladeira →</button></div>';
  const close=document.createElement('button');
  close.className='p3-fridge-close'; close.type='button'; close.setAttribute('aria-label','Fechar geladeira'); close.innerHTML='×';
  const hint=document.createElement('div'); hint.className='p3-fridge-hint'; hint.textContent='Toque em um rótulo para conhecer';
  door.append(panel,close,hint);
  const open=()=>{fridge.classList.add('p3-open');panel.setAttribute('aria-hidden','true')};
  const shut=()=>{fridge.classList.remove('p3-open');panel.removeAttribute('aria-hidden')};
  panel.querySelector('.p3-open-fridge').addEventListener('click',open);
  close.addEventListener('click',shut);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fridge.classList.contains('p3-open'))shut()});
})();
