(function(){
'use strict';
const SUPABASE_URL='https://cqtdrpwnjnetbcnuqtyv.supabase.co';
const KEY='sb_publishable_hY5y6tve470_iBtkQuQiLw_Vs38_nBy';
const grid=document.getElementById('eventsGrid');
if(!grid)return;
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const safeUrl=v=>{try{const u=new URL(String(v||''),location.origin);return /^https?:$/.test(u.protocol)?u.href:''}catch{return ''}};
const formatDate=v=>{if(!v)return 'Data a confirmar';const d=new Date(v+'T12:00:00');return Number.isNaN(d.getTime())?'Data a confirmar':d.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})};
function render(rows){
  grid.replaceChildren();
  if(!rows.length){const p=document.createElement('p');p.className='events-empty';p.textContent='Nenhum próximo evento publicado no momento.';grid.append(p);return}
  rows.forEach(ev=>{
    const card=document.createElement('article');card.className='event-card';
    const media=document.createElement('div');media.className='event-image';
    const img=document.createElement('img');img.loading='lazy';img.alt=ev.title?`Evento ${ev.title}`:'Evento cervejeiro';img.src=safeUrl(ev.image_url)||'assets/compartilhamento-de-link.jpg';media.append(img);
    const body=document.createElement('div');body.className='event-body';
    const date=document.createElement('span');date.className='event-date';date.textContent=formatDate(ev.event_date);
    const title=document.createElement('h3');title.textContent=ev.title||'Evento';
    const local=document.createElement('div');local.className='event-location';local.textContent=ev.location||'Local a confirmar';
    const desc=document.createElement('p');desc.className='event-description';desc.textContent=ev.description||'';
    body.append(date,title,local,desc);
    const buy=safeUrl(ev.purchase_url);if(buy){const a=document.createElement('a');a.className='event-buy';a.href=buy;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Comprar ingresso';body.append(a)}
    card.append(media,body);grid.append(card);
  })
}
const today=new Date();const yyyy=today.getFullYear(),mm=String(today.getMonth()+1).padStart(2,'0'),dd=String(today.getDate()).padStart(2,'0');const isoToday=`${yyyy}-${mm}-${dd}`;
fetch(`${SUPABASE_URL}/rest/v1/events?select=id,title,event_date,location,description,image_url,purchase_url&active=eq.true&event_date=gte.${isoToday}&order=event_date.asc`,{headers:{apikey:KEY,Accept:'application/json'},cache:'no-store'})
.then(r=>{if(!r.ok)throw new Error(`Supabase ${r.status}`);return r.json()}).then(render).catch(err=>{console.warn('Eventos indisponíveis',err);grid.innerHTML='<p class="events-empty">A agenda de eventos está temporariamente indisponível.</p>'});
})();
