(()=>{
  const norm=s=>(s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function init(){
    const catalog=document.querySelector('#catalogo .shell');
    const grid=document.getElementById('beerCatalogGrid');
    if(!catalog||!grid||document.querySelector('.discovery-shelf')) return;
    const beers=(window.CERVEJANDO_BEERS||[]).filter(b=>b.active!==false);
    if(!beers.length||!grid.children.length){setTimeout(init,180);return;}
    const top=catalog.querySelector('.catalog-top');
    const shelf=document.createElement('div'); shelf.className='discovery-shelf';
    shelf.innerHTML=`<div class="discovery-head"><div><span class="discovery-kicker">Descoberta guiada</span><h3 class="discovery-title">O que você quer <em>beber hoje?</em></h3><p class="discovery-sub">Escolha uma sensação e deixe a curadoria do Diegão colocar um rótulo no centro da experiência.</p></div></div><div class="discovery-filters" role="group" aria-label="Descobrir cervejas por perfil"><button class="discovery-chip active" data-discovery="all">Todas</button><button class="discovery-chip" data-discovery="leve">😌 Leve</button><button class="discovery-chip" data-discovery="amarga">🌿 Amarga</button><button class="discovery-chip" data-discovery="frutada">🍊 Frutada</button><button class="discovery-chip" data-discovery="intensa">💥 Intensa</button><button class="discovery-chip" data-discovery="especiais">✨ Especial</button><button class="discovery-chip surprise" data-discovery="surprise">🍺 Me surpreenda</button></div><div class="discovery-stage"><button class="discovery-arrow prev" aria-label="Cerveja anterior">‹</button><div class="discovery-viewport"><div class="discovery-track"></div></div><button class="discovery-arrow next" aria-label="Próxima cerveja">›</button></div><div class="discovery-detail" aria-live="polite"></div>`;
    top.insertAdjacentElement('afterend',shelf);
    const label=document.createElement('div');label.className='catalog-grid-label';label.innerHTML='<strong>Catálogo completo</strong><span>Prefere comparar? Todos os rótulos continuam logo abaixo.</span>'; grid.before(label);
    const track=shelf.querySelector('.discovery-track'), detail=shelf.querySelector('.discovery-detail'), viewport=shelf.querySelector('.discovery-viewport');
    let pool=[...beers], index=0, startX=null;
    const aliases={leve:['leve','leves'],amarga:['amarga','amargas'],frutada:['frutada','frutadas'],intensa:['intensa','intensas'],especiais:['especial','especiais']};
    const matches=(b,f)=>f==='all'||(b.tags||[]).some(t=>(aliases[f]||[f]).includes(norm(t)));
    function render(){
      track.replaceChildren();
      pool.forEach((b,i)=>{const el=document.createElement('article');el.className='discovery-item'+(i===index?' is-active':'');el.innerHTML=`<button class="discovery-can" type="button" aria-label="Conhecer ${b.detail?.title||b.card?.name}"><img src="${b.card?.image||b.detail?.image}" alt="${b.card?.alt||b.detail?.title||''}"></button><span class="discovery-mini">${b.detail?.brewery||b.card?.brand||''}</span><h4 class="discovery-name">${b.card?.name||b.detail?.subtitle||''}</h4>`;el.querySelector('.discovery-can').addEventListener('click',()=>window.openBeerModal?.(b.id));track.append(el)});
      position(); updateDetail();
    }
    function position(){
      const mobile=matchMedia('(max-width:760px)').matches; const basis=mobile?72:33.333; const center=(100-basis)/2; track.style.transform=`translateX(calc(${center}% - ${index*basis}%))`;
      [...track.children].forEach((el,i)=>el.classList.toggle('is-active',i===index));
      shelf.querySelector('.prev').disabled=pool.length<2; shelf.querySelector('.next').disabled=pool.length<2;
    }
    function updateDetail(){
      const b=pool[index]; if(!b){detail.innerHTML='<p class="discovery-rec">Nenhum rótulo encontrado nesse perfil.</p>';return}
      const d=b.detail||{}; const tags=(b.tags||[]).slice(0,3).map(t=>`<span>${t}</span>`).join('');
      detail.innerHTML=`<span class="style">${d.style||d.subtitle||'Seleção do Diegão'}</span><h3>${d.title||b.card?.name||''}</h3><div class="discovery-tags">${tags}</div><p class="discovery-rec"><b>Diegão indica para:</b> ${d.goodFor||'quem quer descobrir um rótulo diferente.'}</p><div class="discovery-specs"><span><strong>${d.abv||'—'}</strong> álcool</span><span><strong>${d.ibu||'—'}</strong> IBU</span><span><strong>${d.volume||'—'}</strong></span></div><div class="discovery-actions"><button class="discovery-action secondary" data-detail>Conhecer o rótulo</button><button class="discovery-action" data-add>Adicionar ao pedido</button></div><div class="discovery-count">${index+1} / ${pool.length} · arraste para descobrir</div>`;
      detail.querySelector('[data-detail]').onclick=()=>window.openBeerModal?.(b.id);
      detail.querySelector('[data-add]').onclick=()=>{const card=grid.querySelector(`[data-target="${CSS.escape(b.id)}"]`);card?.querySelector('.add-to-order')?.click()};
    }
    function go(delta){if(pool.length<2)return;index=(index+delta+pool.length)%pool.length;position();updateDetail()}
    shelf.querySelector('.prev').onclick=()=>go(-1); shelf.querySelector('.next').onclick=()=>go(1);
    viewport.addEventListener('pointerdown',e=>{startX=e.clientX;viewport.setPointerCapture?.(e.pointerId)});viewport.addEventListener('pointerup',e=>{if(startX==null)return;const dx=e.clientX-startX;startX=null;if(Math.abs(dx)>35)go(dx<0?1:-1)});
    shelf.querySelectorAll('.discovery-chip').forEach(chip=>chip.addEventListener('click',()=>{
      const f=chip.dataset.discovery;shelf.querySelectorAll('.discovery-chip').forEach(c=>c.classList.toggle('active',c===chip));
      if(f==='surprise'){
        pool=[...beers]; shelf.classList.add('is-shuffling'); let spins=0; const timer=setInterval(()=>{index=Math.floor(Math.random()*pool.length);position();updateDetail();if(++spins>7){clearInterval(timer);shelf.classList.remove('is-shuffling')}},90);return;
      }
      pool=beers.filter(b=>matches(b,f));index=0;render();
      const original=document.querySelector(`.filter-btn[data-filter="${f}"]`)||document.querySelector('.filter-btn[data-filter="all"]');original?.click();
    }));
    addEventListener('resize',position,{passive:true}); render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,220));else setTimeout(init,220);
})();
