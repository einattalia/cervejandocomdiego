(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const desktop=matchMedia('(min-width:901px)').matches;
 const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
 if(reduce) return;

 function howStory(){
   const sec=q('#como-funciona'), steps=sec?qa('.how-steps article',sec):[];
   if(!sec||!steps.length)return;
   sec.classList.add('phase2-ready');
   const prog=document.createElement('div');
   prog.className='phase2-progress'; prog.innerHTML='<span></span>';
   q('.how-steps',sec)?.append(prog);
   function active(i){steps.forEach((s,n)=>s.classList.toggle('is-story-active',n===i)); if(prog.firstElementChild) prog.firstElementChild.style.transform=`scaleX(${(i+1)/steps.length})`;}
   if(window.gsap&&window.ScrollTrigger){
     steps.forEach((step,i)=>{
       gsap.fromTo(step,{opacity:.58,y:desktop?24:16,scale:.985},{opacity:1,y:0,scale:1,duration:.55,ease:'power2.out',scrollTrigger:{trigger:step,start:'top 82%',toggleActions:'play none none reverse',onEnter:()=>active(i),onEnterBack:()=>active(i)}});
     });
   }else{
     const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)active(steps.indexOf(e.target))}),{threshold:.5});
     steps.forEach(s=>io.observe(s));
   }
   active(0);
 }

 function curatorStory(){
   const sec=q('#sobre'), stage=q('.about-photo-stage',sec);
   if(!sec||!stage||!window.gsap||!window.ScrollTrigger)return;
   // Somente profundidade sutil na foto. Nenhum texto/word cloud sobre a imagem.
   if(desktop){
     gsap.fromTo(stage,{scale:1},{scale:1.025,ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:.8}});
   }
 }

 function sectionDepth(){
   if(!window.gsap||!window.ScrollTrigger||!desktop)return;
   qa('#eventos .events-heading,#dicas .tips-grid>div:first-child').forEach(el=>gsap.fromTo(el,{y:12},{y:-5,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
 }

 addEventListener('DOMContentLoaded',()=>setTimeout(()=>{howStory();curatorStory();sectionDepth();window.ScrollTrigger?.refresh()},80));
})();
