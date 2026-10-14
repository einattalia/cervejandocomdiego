(()=>{
  'use strict';
  const endpoint='/api/track-analytics';
  const uuid=()=>{if(crypto.randomUUID)return crypto.randomUUID();const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const hex=[...bytes].map(value=>value.toString(16).padStart(2,'0')).join('');return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`};
  const readId=(key,area)=>{try{const storage=area==='local'?window.localStorage:window.sessionStorage;let id=storage.getItem(key);if(!id){id=uuid();storage.setItem(key,id)}return id}catch{return uuid()}};
  const visitorId=readId('cd_analytics_visitor','local');
  const sessionId=readId('cd_analytics_session','session');
  const params=new URLSearchParams(location.search);
  const referrer=(()=>{try{return document.referrer?new URL(document.referrer).origin:''}catch{return ''}})();
  const knownSources=['google','bing','yahoo','duckduckgo','instagram','facebook','tiktok','youtube','whatsapp'];
  const refHost=(()=>{try{return document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):''}catch{return ''}})();
  const trafficSource=(params.get('utm_source')||knownSources.find(key=>new RegExp(`(^|\\.)${key}\\.`,'i').test(refHost))||refHost||'(direto)').slice(0,120);
  const trafficMedium=(params.get('utm_medium')|| (refHost?'referral':'(nenhum)')).slice(0,80);
  const campaign=(params.get('utm_campaign')||'').slice(0,120);
  const ga=[];
  let gaReady=false;
  let gaClientId=null,gaSessionId=null,resolveGaIdentity;
  const gaIdentityReady=new Promise(resolve=>{resolveGaIdentity=resolve});
  function gaEvent(name,params={}){if(gaReady)window.gtag('event',name,params)}
  function readGaValue(id,key){return new Promise(resolve=>{const timeout=setTimeout(()=>resolve(null),1100);window.gtag('get',id,key,value=>{clearTimeout(timeout);resolve(value||null)})})}
  async function initGa(){
    try{
      await new Promise((resolve,reject)=>{const script=document.createElement('script');script.async=true;script.src='/api/analytics-config.js';script.onload=resolve;script.onerror=reject;document.head.append(script)});
      const id=window.CERVEJANDO_GA4_ID;
      if(!id){resolveGaIdentity();return;}
      const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;document.head.append(script);
      window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',id,{send_page_view:false});gaReady=true;
      for(const item of ga)gaEvent(item.name,item.params);
      [gaClientId,gaSessionId]=await Promise.all([readGaValue(id,'client_id'),readGaValue(id,'session_id')]);resolveGaIdentity();
    }catch(error){resolveGaIdentity();console.warn('GA4 indisponível',error)}
  }
  function track(eventName,extra={}){
    const event={event_id:uuid(),event_name:eventName,visitor_id:visitorId,session_id:sessionId,page_path:location.pathname,referrer,traffic_source:trafficSource,traffic_medium:trafficMedium,traffic_campaign:campaign,...extra};
    fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event),keepalive:true}).catch(()=>{});
    const gaName={page_view:'page_view',product_view:'view_item',add_to_cart:'add_to_cart',begin_checkout:'begin_checkout',purchase:'purchase'}[eventName];
    if(gaName){const params={page_path:event.page_path,page_title:document.title,traffic_source:event.traffic_source,traffic_medium:event.traffic_medium,campaign:event.traffic_campaign};if(extra.product_slug)params.item_id=extra.product_slug;if(extra.product_name)params.item_name=extra.product_name;if(extra.price){params.currency='BRL';params.value=extra.price;params.items=[{item_id:extra.product_slug,item_name:extra.product_name,price:extra.price,quantity:1}]}if(extra.items){params.currency=extra.currency||'BRL';params.value=Number(extra.value)||0;params.items=extra.items}ga.push({name:gaName,params});gaEvent(gaName,params)}
  }
  function identifyProduct(name,kitSlug=''){
    const beer=(window.CERVEJANDO_BEERS||[]).find(item=>(item.detail?.orderName||item.detail?.title)===name);
    const kit=(window.CERVEJANDO_KITS||[]).find(item=>item.slug===kitSlug||item.name===name);
    const item=beer||kit;
    return {product_slug:item?.slug||item?.id||kitSlug||'',product_name:item?.detail?.title||item?.name||name||'',price:Number(item?.price)||0};
  }
  window.cervejandoAnalytics={track,identity:async()=>{await Promise.race([gaIdentityReady,new Promise(resolve=>setTimeout(resolve,1200))]);return{visitor_id:visitorId,session_id:sessionId,ga_client_id:gaClientId,ga_session_id:gaSessionId}},identifyProduct};
  initGa();
  track('page_view');
  document.addEventListener('click',event=>{
    const add=event.target.closest('.add-to-order');
    if(add){track('add_to_cart',identifyProduct(add.dataset.beer||'',add.dataset.kitSlug||''));return}
  },true);
  if('IntersectionObserver'in window){const seen=new Set();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||entry.intersectionRatio<.5)return;const card=entry.target;if(card.matches('.beer-card')){const beer=(window.CERVEJANDO_BEERS||[]).find(item=>item.id===card.dataset.target);if(beer&&!seen.has(beer.slug||beer.id)){const key=beer.slug||beer.id;seen.add(key);track('product_view',{product_slug:key,product_name:beer.detail?.title||'',price:Number(beer.price)||0})}}else{const kit=(window.CERVEJANDO_KITS||[]).find(item=>item.name===card.querySelector('h3')?.textContent);if(kit&&!seen.has(kit.slug)){seen.add(kit.slug);track('product_view',{product_slug:kit.slug,product_name:kit.name,price:Number(kit.price)||0})}}}),{threshold:.5});const observeCards=container=>{const observe=node=>{if(node.nodeType!==1)return;if(node.matches('.beer-card,.kit-card'))observer.observe(node);node.querySelectorAll?.('.beer-card,.kit-card').forEach(card=>observer.observe(card))};container.querySelectorAll('.beer-card,.kit-card').forEach(observer.observe,observer);new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(observe))).observe(container,{childList:true,subtree:true})};document.querySelectorAll('#beerCatalogGrid,#kitsCatalogGrid').forEach(observeCards)}
  else document.addEventListener('click',event=>{const card=event.target.closest('.beer-card,.kit-card');if(card?.matches('.beer-card')){const beer=(window.CERVEJANDO_BEERS||[]).find(item=>item.id===card.dataset.target);if(beer)track('product_view',{product_slug:beer.slug||beer.id,product_name:beer.detail?.title||'',price:Number(beer.price)||0})}else if(card){const kit=(window.CERVEJANDO_KITS||[]).find(item=>item.name===card.querySelector('h3')?.textContent);if(kit)track('product_view',{product_slug:kit.slug,product_name:kit.name,price:Number(kit.price)||0})}},true);
  window.addEventListener('cervejando:open-checkout',()=>{const cart=window.CervejandoCart,items=cart?.getItems?.()||[];track('begin_checkout',{currency:'BRL',value:Number(cart?.subtotal?.()||0),items:items.map(item=>({item_id:item.slug,item_name:item.name,item_category:item.type==='kit'?'Kit':'Cerveja',price:Number(item.unitPrice)||0,quantity:Number(item.quantity)||1}))})});
})();
