const Stripe=require('stripe');
const {createClient}=require('@supabase/supabase-js');
function json(res,status,body){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));}
function orderCode(){const d=new Date();return `CD${String(d.getUTCFullYear()).slice(-2)}${String(d.getUTCMonth()+1).padStart(2,'0')}${String(d.getUTCDate()).padStart(2,'0')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;}
module.exports=async function handler(req,res){
 if(req.method!=='POST')return json(res,405,{error:'Método não permitido.'});
 const {STRIPE_SECRET_KEY,SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,DELIVERY_FEE_CENTS='0'}=process.env;
 if(!STRIPE_SECRET_KEY||!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY)return json(res,503,{error:'Pagamento ainda não foi configurado no servidor.'});
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};const items=Array.isArray(body.items)?body.items:[];const customer=body.customer||{};const delivery=body.delivery||{};
  if(body.ageConfirmed!==true)return json(res,403,{error:'É necessário declarar ter 18 anos ou mais para comprar bebidas alcoólicas.'});
  if(!customer.name||!customer.email||!customer.phone||!items.length)return json(res,400,{error:'Preencha seus dados e adicione ao menos um produto.'});
  if(items.length>30)return json(res,400,{error:'Pedido acima do limite de itens.'});
  if(delivery.type==='delivery'){const a=delivery.address||{};if(!a.cep||!a.city||!a.street||!a.number||!a.district)return json(res,400,{error:'Preencha CEP, cidade, endereço, número e bairro para entrega.'});}
  const normalized=items.map(i=>({type:i.type==='kit'?'kit':'beer',slug:String(i.slug||'').trim(),quantity:Math.max(1,Math.min(24,Number(i.quantity)||1))})).filter(i=>i.slug);
  if(!normalized.length)return json(res,400,{error:'Adicione ao menos um produto válido.'});
  const beerSlugs=[...new Set(normalized.filter(i=>i.type==='beer').map(i=>i.slug))];const kitSlugs=[...new Set(normalized.filter(i=>i.type==='kit').map(i=>i.slug))];
  const supabase=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
  const [beerResult,kitResult]=await Promise.all([
   beerSlugs.length?supabase.from('beers').select('id,slug,title,name,order_name,price,stock_status,stock_quantity,active').in('slug',beerSlugs):Promise.resolve({data:[],error:null}),
   kitSlugs.length?supabase.from('kits').select('id,slug,name,description,price,image_url,active').in('slug',kitSlugs):Promise.resolve({data:[],error:null})
  ]);
  if(beerResult.error)throw beerResult.error;if(kitResult.error)throw kitResult.error;
  if((beerResult.data||[]).length!==beerSlugs.length||(kitResult.data||[]).length!==kitSlugs.length)return json(res,409,{error:'Um dos produtos não está mais disponível.'});
  const beerMap=new Map((beerResult.data||[]).map(x=>[x.slug,x]));const kitMap=new Map((kitResult.data||[]).map(x=>[x.slug,x]));
  const kitIds=[...(kitResult.data||[])].map(x=>x.id);let components=[];
  if(kitIds.length){const result=await supabase.from('kit_components').select('kit_id,component_type,beer_id,inventory_item_id,component_name_snapshot,quantity,unit_cost,sort_order').in('kit_id',kitIds).order('sort_order');if(result.error)throw result.error;components=result.data||[];}
  const beerIds=[...new Set([...beerMap.values()].map(x=>x.id).concat(components.filter(c=>c.beer_id).map(c=>c.beer_id)))];
  const inventoryIds=[...new Set(components.filter(c=>c.inventory_item_id).map(c=>c.inventory_item_id))];
  const [componentBeerResult,inventoryResult]=await Promise.all([
   beerIds.length?supabase.from('beers').select('id,title,name,stock_status,stock_quantity,active').in('id',beerIds):Promise.resolve({data:[],error:null}),
   inventoryIds.length?supabase.from('inventory_items').select('id,name,stock_quantity,active').in('id',inventoryIds):Promise.resolve({data:[],error:null})
  ]);
  if(componentBeerResult.error)throw componentBeerResult.error;if(inventoryResult.error)throw inventoryResult.error;
  const componentBeers=new Map((componentBeerResult.data||[]).map(x=>[x.id,x]));const inventory=new Map((inventoryResult.data||[]).map(x=>[x.id,x]));
  const componentByKit=new Map();for(const c of components){if(!componentByKit.has(c.kit_id))componentByKit.set(c.kit_id,[]);componentByKit.get(c.kit_id).push(c)}
  const stockDemand=new Map();const lines=[];let subtotal=0;
  for(const item of normalized){
   if(item.type==='beer'){
    const beer=beerMap.get(item.slug);if(!beer||beer.active===false||beer.stock_status==='sold_out')return json(res,409,{error:`${beer?.title||item.slug} está esgotada.`});
    const price=Number(beer.price);if(!Number.isFinite(price)||price<=0)return json(res,409,{error:`${beer.title||beer.name} está sem preço para venda online.`});
    if(beer.stock_quantity!==null&&beer.stock_quantity!==undefined)stockDemand.set(`beer:${beer.id}`,(stockDemand.get(`beer:${beer.id}`)||0)+item.quantity);
    const name=beer.order_name||beer.title||beer.name;subtotal+=price*item.quantity;lines.push({beer_id:beer.id,kit_id:null,item_type:'beer',components_snapshot:[],beer_slug:beer.slug,beer_name_snapshot:name,unit_price:price,quantity:item.quantity,line_total:Number((price*item.quantity).toFixed(2))});
   }else{
    const kit=kitMap.get(item.slug);if(!kit||kit.active===false)return json(res,409,{error:`${kit?.name||item.slug} não está disponível.`});
    const recipe=componentByKit.get(kit.id)||[];if(!recipe.length)return json(res,409,{error:`${kit.name} está sem componentes configurados.`});
    const price=Number(kit.price);if(!Number.isFinite(price)||price<=0)return json(res,409,{error:`${kit.name} está sem preço para venda online.`});
    const snapshot=[];
    for(const c of recipe){const amount=Number(c.quantity);if(!Number.isInteger(amount)||amount<1)return json(res,409,{error:`A composição de ${kit.name} precisa ser revisada.`});const beerId=c.component_type==='beer'?c.beer_id:null,inventoryId=c.component_type==='inventory'?c.inventory_item_id:null;const source=beerId?componentBeers.get(beerId):inventory.get(inventoryId);if(!source||source.active===false||(beerId&&source.stock_status==='sold_out'))return json(res,409,{error:`Um componente de ${kit.name} não está disponível.`});const available=source.stock_quantity;if(available!==null&&available!==undefined)stockDemand.set(`${beerId?'beer':'inventory'}:${source.id}`,(stockDemand.get(`${beerId?'beer':'inventory'}:${source.id}`)||0)+amount*item.quantity);snapshot.push({beer_id:beerId,inventory_item_id:inventoryId,quantity:amount,name:c.component_name_snapshot||source.title||source.name});}
    subtotal+=price*item.quantity;lines.push({beer_id:null,kit_id:kit.id,item_type:'kit',components_snapshot:snapshot,beer_slug:kit.slug,beer_name_snapshot:kit.name,unit_price:price,quantity:item.quantity,line_total:Number((price*item.quantity).toFixed(2))});
   }
  }
  for(const [key,demand] of stockDemand){const [type,id]=key.split(':');const source=type==='beer'?componentBeers.get(id):inventory.get(id);const available=Number(source?.stock_quantity);if(!source||!Number.isFinite(available)||available<demand)return json(res,409,{error:`Estoque insuficiente de ${source?.title||source?.name||'um componente do pedido'}.`});}
  subtotal=Number(subtotal.toFixed(2));const deliveryFee=delivery.type==='delivery'?Math.max(0,Number.parseInt(DELIVERY_FEE_CENTS,10)||0)/100:0;const total=Number((subtotal+deliveryFee).toFixed(2));const code=orderCode();
  const {data:order,error:orderError}=await supabase.from('orders').insert({order_code:code,customer_name:String(customer.name).slice(0,120),customer_email:String(customer.email).slice(0,160),customer_phone:String(customer.phone).slice(0,30),delivery_type:delivery.type==='delivery'?'delivery':'pickup',delivery_address:delivery.type==='delivery'?delivery.address:null,notes:String(body.notes||'').slice(0,500),subtotal,delivery_fee:deliveryFee,total,status:'awaiting_payment',payment_status:'pending',age_verified:true,age_verified_at:new Date().toISOString()}).select('id,order_code').single();if(orderError)throw orderError;
  const {error:itemError}=await supabase.from('order_items').insert(lines.map(l=>({...l,order_id:order.id})));if(itemError)throw itemError;
  const stripe=new Stripe(STRIPE_SECRET_KEY);const origin=`${req.headers['x-forwarded-proto']||'https'}://${req.headers.host}`;
  const stripeLines=lines.map(l=>({quantity:l.quantity,price_data:{currency:'brl',unit_amount:Math.round(l.unit_price*100),product_data:{name:l.beer_name_snapshot}}}));
  if(deliveryFee>0)stripeLines.push({quantity:1,price_data:{currency:'brl',unit_amount:Math.round(deliveryFee*100),product_data:{name:'Taxa de entrega'}}});
  const session=await stripe.checkout.sessions.create({mode:'payment',customer_email:customer.email,client_reference_id:order.id,metadata:{order_id:order.id,order_code:code,age_verified:'true'},line_items:stripeLines,success_url:`${origin}/pedido-confirmado?pedido=${encodeURIComponent(code)}&session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/pedido-confirmado?pedido=${encodeURIComponent(code)}&status=cancelled`});
  const {error:updateError}=await supabase.from('orders').update({stripe_checkout_session_id:session.id}).eq('id',order.id);if(updateError)throw updateError;
  return json(res,200,{url:session.url,orderCode:code});
 }catch(err){console.error(err);return json(res,500,{error:'Não foi possível criar o checkout. Tente novamente.'});}
};
