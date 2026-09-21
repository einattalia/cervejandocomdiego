(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];

  function heroIntro(){
    if(reduce) return;
    const gsap=window.gsap;
    if(!gsap) return;
    const items=['.hero .eyebrow','.hero .hero-familiar','.hero .hero-different'];
    gsap.set(items,{opacity:0,y:24});
    gsap.set('.hero .feature',{opacity:0,y:18});
    gsap.set('.hero .hero-premium-cta',{opacity:0,y:14});
    gsap.set('.hero .premium-fridge',{opacity:0,x:34,scale:.97});
    const tl=gsap.timeline({defaults:{ease:'power3.out'}});
    tl.to(items,{opacity:1,y:0,duration:.72,stagger:.12})
      .to('.hero .feature',{opacity:1,y:0,duration:.55,stagger:.09},'-=.32')
      .to('.hero .hero-premium-cta',{opacity:1,y:0,duration:.5},'-=.22')
      .to('.hero .premium-fridge',{opacity:1,x:0,scale:1,duration:1.05},'-=.85');
    if(window.ScrollTrigger && fine){
      gsap.to('.hero .premium-fridge',{y:22,scale:.985,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.8}});
    }
  }

  function headerMotion(){
    const header=q('header'); if(!header) return;
    const sync=()=>header.classList.toggle('motion-scrolled',scrollY>24);
    sync(); addEventListener('scroll',sync,{passive:true});
  }

  function reveals(){
    const targets=qa('main > section:not(.hero) .eyebrow, main > section:not(.hero) h2, main > section:not(.hero) .catalog-top > div:first-child, .how-section .feature, .about-copy, .tips-grid > div');
    targets.forEach(el=>el.classList.add('motion-reveal'));
    if(reduce){targets.forEach(el=>el.classList.add('is-visible'));return;}
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -8%'});
    targets.forEach(el=>io.observe(el));
  }

  function buttonRipples(){
    document.addEventListener('pointerdown',e=>{
      const b=e.target.closest('.hero-premium-cta,.filter-btn,.circle-btn,.card-add,.tips-form button');
      if(!b||reduce) return;
      const r=b.getBoundingClientRect(), s=document.createElement('span');
      s.className='motion-ripple'; s.style.left=`${e.clientX-r.left}px`; s.style.top=`${e.clientY-r.top}px`; s.style.width=s.style.height='24px'; b.append(s); setTimeout(()=>s.remove(),700);
    });
  }

  function cards(){
    const grid=q('#beerCatalogGrid'); if(!grid) return;
    const init=()=>qa('.beer-card',grid).forEach((card,i)=>{
      if(card.dataset.motionReady) return; card.dataset.motionReady='1';
      if(!reduce){card.classList.add('motion-enter');card.style.animationDelay=`${Math.min(i,7)*55}ms`;}
      if(fine&&!reduce){
        card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*3.2}deg) rotateY(${x*4.2}deg) translateY(-4px)`;card.classList.add('motion-hover')});
        card.addEventListener('pointerleave',()=>{card.style.transform='';card.classList.remove('motion-hover')});
      }
    });
    init(); new MutationObserver(init).observe(grid,{childList:true});
  }

  function cartFeedback(){
    const count=q('#cartCount'); if(!count) return;
    let old=count.textContent;
    new MutationObserver(()=>{if(count.textContent!==old){old=count.textContent;count.classList.remove('motion-pop');void count.offsetWidth;count.classList.add('motion-pop')}}).observe(count,{childList:true,characterData:true,subtree:true});
    document.addEventListener('click',e=>{const btn=e.target.closest('.add-to-order');if(!btn||btn.disabled) return;showToast('Boa escolha. Entrou no pedido 🍺')},true);
  }
  function showToast(msg){
    let t=q('.motion-toast'); if(!t){t=document.createElement('div');t.className='motion-toast';document.body.append(t)} t.textContent=msg;
    if(window.gsap&&!reduce){gsap.killTweensOf(t);gsap.fromTo(t,{opacity:0,y:-10},{opacity:1,y:0,duration:.3,onComplete:()=>gsap.to(t,{opacity:0,y:-8,duration:.3,delay:1.05})})}else{t.style.opacity='1';setTimeout(()=>t.style.opacity='0',1200)}
  }

  function cursor(){
    if(!fine||reduce) return; const c=document.createElement('div');c.className='motion-cursor';document.body.append(c);
    let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
    addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY},{passive:true});
    const loop=()=>{cx+=(x-cx)*.18;cy+=(y-cy)*.18;c.style.left=cx+'px';c.style.top=cy+'px';requestAnimationFrame(loop)};loop();
    const map=[['#beerCatalogGrid .beer-card','VER RÓTULO'],['.fridge-can','CONHECER'],['#sobre','DIEGÃO'],['#eventos','PARTIU?']];
    document.addEventListener('pointerover',e=>{const hit=map.find(([s])=>e.target.closest(s));if(hit){c.textContent=hit[1];c.classList.add('show')}});
    document.addEventListener('pointerout',e=>{if(map.some(([s])=>e.target.closest(s))&&!map.some(([s])=>e.relatedTarget?.closest?.(s)))c.classList.remove('show')});
  }

  function navActive(){
    const links=qa('nav a[href^="#"]'); const sections=links.map(a=>q(a.getAttribute('href'))).filter(Boolean); if(!sections.length)return;
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55%'});sections.forEach(s=>io.observe(s));
  }

  addEventListener('DOMContentLoaded',()=>{headerMotion();reveals();buttonRipples();cards();cartFeedback();cursor();navActive();setTimeout(heroIntro,40)});
})();
