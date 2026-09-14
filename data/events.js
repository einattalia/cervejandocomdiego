(function(){
'use strict';
const SUPABASE_URL='https://cqtdrpwnjnetbcnuqtyv.supabase.co';
const KEY='sb_publishable_hY5y6tve470_iBtkQuQiLw_Vs38_nBy';
const grid=document.getElementById('eventsGrid');
if(!grid)return;
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const safeUrl=v=>{try{const u=new URL(String(v||''),location.origin);return /^https?:$/.test(u.protocol)?u.href:''}catch{return ''}};
const formatDate=(v,end)=>{if(!v)return 'Data a confirmar';const a=new Date(v+'T12:00:00');if(Number.isNaN(a.getTime()))return 'Data a confirmar';if(!end||end===v)return a.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});const b=new Date(end+'T12:00:00');if(Number.isNaN(b.getTime()))return a.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});if(a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth())return `${a.getDate()} e ${b.getDate()} de ${a.toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}`;return `${a.toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})} a ${b.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})}`};
const dayMs=86400000;
function eventCallout(v){
  if(!v)return '';
  const eventDate=new Date(v+'T12:00:00');
  if(Number.isNaN(eventDate.getTime()))return '';
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  const diff=Math.round((eventDate-today)/dayMs);
  if(diff<0)return '';
  if(diff===0)return 'É hoje';
  if(diff===1)return 'É amanhã';
  const weekday=eventDate.toLocaleDateString('pt-BR',{weekday:'long'}).replace('-feira','');
  if(diff<=7)return `É neste ${weekday}`;
  if(diff<=30)return `Faltam ${diff} dias`;
  return '';
}
function render(rows){
  grid.replaceChildren();
  if(!rows.length){const p=document.createElement('p');p.className='events-empty';p.textContent='Nenhum próximo evento publicado no momento.';grid.append(p);return}
  rows.forEach(ev=>{
    const card=document.createElement('article');card.className='event-card';
    const media=document.createElement('div');media.className='event-image';
    const img=document.createElement('img');img.loading='lazy';img.alt=ev.title?`Evento ${ev.title}`:'Evento cervejeiro';img.src=safeUrl(ev.image_url)||'assets/compartilhamento-de-link.jpg';media.append(img);
    const body=document.createElement('div');body.className='event-body';
    const calloutText=eventCallout(ev.event_date);
    if(calloutText){const callout=document.createElement('div');callout.className='event-callout';callout.textContent=calloutText;body.append(callout)}
    const date=document.createElement('span');date.className='event-date';date.textContent=formatDate(ev.event_date,ev.event_end_date);
    const title=document.createElement('h3');title.textContent=ev.title||'Evento';
    const local=document.createElement('div');local.className='event-location';local.textContent=ev.location||'Local a confirmar';
    const desc=document.createElement('p');desc.className='event-description';desc.textContent=ev.description||'';
    body.append(date,title,local);if(ev.instagram_handle){const handle=String(ev.instagram_handle).trim().replace(/^@/,'');if(/^[A-Za-z0-9._]+$/.test(handle)){const insta=document.createElement('a');insta.className='event-instagram';insta.href=`https://www.instagram.com/${handle}/`;insta.target='_blank';insta.rel='noopener noreferrer';insta.textContent=`@${handle}`;body.append(insta)}}body.append(desc);
    const buy=safeUrl(ev.purchase_url);if(buy){const a=document.createElement('a');a.className='event-buy';a.href=buy;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Comprar ingresso';body.append(a)}
    card.append(media,body);grid.append(card);
  })
}
const today=new Date();const yyyy=today.getFullYear(),mm=String(today.getMonth()+1).padStart(2,'0'),dd=String(today.getDate()).padStart(2,'0');const isoToday=`${yyyy}-${mm}-${dd}`;
fetch(`${SUPABASE_URL}/rest/v1/events?select=id,title,event_date,event_end_date,location,description,image_url,purchase_url,instagram_handle&active=eq.true&order=event_date.asc`,{headers:{apikey:KEY,Accept:'application/json'},cache:'no-store'})
.then(r=>{if(!r.ok)throw new Error(`Supabase ${r.status}`);return r.json()}).then(rows=>render(rows.filter(ev=>(ev.event_end_date||ev.event_date)>=isoToday))).catch(err=>{console.warn('Eventos indisponíveis',err);grid.innerHTML='<p class="events-empty">A agenda de eventos está temporariamente indisponível.</p>'});
})();
