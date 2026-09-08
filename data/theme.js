(()=>{
  'use strict';
  const STORAGE_KEY='cervejando-theme';
  const body=document.body;
  const toggle=document.getElementById('themeToggle');
  if(!body || !toggle) return;

  const saved=(()=>{try{return localStorage.getItem(STORAGE_KEY)}catch(_){return null}})();
  const initial=saved==='light' || saved==='dark' ? saved : 'dark';

  function applyTheme(theme,persist){
    const light=theme==='light';
    body.classList.toggle('theme-light',light);
    document.documentElement.style.colorScheme=light?'light':'dark';
    toggle.setAttribute('aria-pressed',String(light));
    toggle.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');
    toggle.setAttribute('title',light?'Usar tema escuro':'Usar tema claro');
    if(persist){try{localStorage.setItem(STORAGE_KEY,theme)}catch(_){}}
  }

  applyTheme(initial,false);
  toggle.addEventListener('click',()=>{
    applyTheme(body.classList.contains('theme-light')?'dark':'light',true);
  });
})();
