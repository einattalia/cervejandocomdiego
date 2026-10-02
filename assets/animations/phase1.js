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
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    if(preference.matches || !window.IntersectionObserver || !Element.prototype.animate) return;
    const registered=new WeakSet(), played=new Set(), running=new Set();
    const observer=new IntersectionObserver(entries=>{
      let cardIndex=0;
      entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top||a.boundingClientRect.left-b.boundingClientRect.left).forEach(entry=>{
        const el=entry.target;
        observer.unobserve(el);
        const key=el.matches('.beer-card') ? el.dataset.target : null;
        if(key && played.has(key)) return;
        if(key) played.add(key);
        el.dataset.scrollRevealed='true';
        if(preference.matches) return;
        const mobile=matchMedia('(max-width: 700px)').matches;
        const isCard=el.matches('.beer-card');
        const delay=isCard ? Math.min(cardIndex++,3)*(mobile?45:75) : 0;
        const animation=el.animate([
          {opacity:0,translate:'0 '+(mobile?10:20)+'px'},
          {opacity:1,translate:'0 0'}
        ],{duration:mobile?420:620,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
        running.add(animation);
        const done=()=>running.delete(animation);
        animation.addEventListener('finish',done,{once:true});
        animation.addEventListener('cancel',done,{once:true});
      });
    },{threshold:.06,rootMargin:'0px 0px -24px'});
    const register=el=>{if(!registered.has(el)){registered.add(el);observer.observe(el)}};
    qa('main > section:not(.hero) .eyebrow,main > section:not(.hero) h2,main > section:not(.hero) p,.about-photo,footer').filter(el=>!el.closest('.beer-card,.how-steps,.event-card,.quiz-card,.tips-success')).forEach(register);
    const grid=q('#beerCatalogGrid');
    if(grid){
      const refresh=()=>qa('.beer-card',grid).forEach(register);
      refresh();
      new MutationObserver(refresh).observe(grid,{childList:true});
    }
    preference.addEventListener('change',event=>{
      if(event.matches){observer.disconnect();running.forEach(animation=>animation.cancel());running.clear()}
    });
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

  function navActive(){
    const links=qa('nav a[href^="#"]'); const sections=links.map(a=>q(a.getAttribute('href'))).filter(Boolean); if(!sections.length)return;
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55%'});sections.forEach(s=>io.observe(s));
  }

  addEventListener('DOMContentLoaded',()=>{headerMotion();reveals();buttonRipples();cards();cartFeedback();navActive();setTimeout(heroIntro,40)});
})();
