/*
  CERVEJANDO COM DIEGO — SUPABASE v17.1
  O catálogo público é carregado do Supabase.
  data/cervejas.js permanece como fallback local caso a API esteja indisponível.
  A chave abaixo é PUBLICÁVEL e foi criada para uso no navegador; não é uma chave secreta.
*/
(function(){
  'use strict';

  const SUPABASE_URL='https://cqtdrpwnjnetbcnuqtyv.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_hY5y6tve470_iBtkQuQiLw_Vs38_nBy';

  function mapBeer(row,tags){
    const image=row.image_url||'';
    return {
      id:row.slug,
      slug:row.slug,
      active:row.active!==false,
      sortOrder:Number(row.sort_order)||0,
      tags:tags||[],
      price:row.price===null||row.price===undefined?null:Number(row.price),
      stockStatus:row.stock_status||'in_stock',
      card:{
        brand:row.brand||'',
        name:row.name||'',
        image:image,
        alt:row.image_alt||row.title||row.name||'Cerveja',
        signal:Number(row.signal)||0,
        ariaLabel:`Ver detalhes de ${row.title||row.name||'cerveja'}`
      },
      detail:{
        title:row.title||row.name||'',
        subtitle:row.subtitle||row.style||'',
        image:image,
        imageAlt:row.image_alt||row.title||row.name||'Cerveja',
        style:row.style||'Não divulgado',
        brewery:row.brewery||'Não divulgado',
        volume:row.volume||'Não divulgado',
        abv:row.abv||'Não divulgado',
        ibu:row.ibu||'Não divulgado',
        hops:row.hops||'Não divulgado',
        description:row.description||'',
        intensity:row.intensity||'Não divulgado',
        bitterness:row.bitterness||'Não divulgado',
        profile:row.profile||'Não divulgado',
        goodFor:row.recommendation||'',
        orderName:row.order_name||row.title||row.name||''
      }
    };
  }

  async function supabaseFetch(path){
    const response=await fetch(`${SUPABASE_URL}${path}`,{
      method:'GET',
      headers:{
        'apikey':SUPABASE_PUBLISHABLE_KEY,
        'Accept':'application/json'
      },
      cache:'no-store'
    });
    if(!response.ok){
      throw new Error(`Supabase respondeu ${response.status}`);
    }
    return response.json();
  }

  window.loadCervejandoCatalog=async function(){
    const fallback=Array.isArray(window.CERVEJANDO_BEERS)?window.CERVEJANDO_BEERS:[];
    try{
      const [rows,tagRows]=await Promise.all([
        supabaseFetch('/rest/v1/beers?select=id,slug,brand,name,title,subtitle,style,brewery,volume,abv,ibu,hops,description,intensity,bitterness,profile,recommendation,image_url,image_alt,signal,active,featured,sort_order,order_name,price,stock_status&active=eq.true&order=sort_order.asc'),
        supabaseFetch('/rest/v1/beer_tags?select=beer_id,tag')
      ]);

      if(!Array.isArray(rows)||rows.length===0){
        throw new Error('Catálogo remoto vazio');
      }

      const tagsByBeer=new Map();
      (Array.isArray(tagRows)?tagRows:[]).forEach(item=>{
        if(!tagsByBeer.has(item.beer_id)) tagsByBeer.set(item.beer_id,[]);
        tagsByBeer.get(item.beer_id).push(item.tag);
      });

      window.CERVEJANDO_BEERS=rows.map(row=>mapBeer(row,tagsByBeer.get(row.id)||[]));
      document.documentElement.dataset.catalogSource='supabase';
      return {source:'supabase',count:window.CERVEJANDO_BEERS.length};
    }catch(error){
      console.warn('Cervejando com Diego: usando catálogo local de segurança.',error);
      window.CERVEJANDO_BEERS=fallback;
      document.documentElement.dataset.catalogSource='local-fallback';
      return {source:'local-fallback',count:fallback.length};
    }
  };
})();
