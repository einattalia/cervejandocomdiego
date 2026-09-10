const Stripe=require('stripe');
const {createClient}=require('@supabase/supabase-js');
function json(res,status,body){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));}
function orderCode(){const d=new Date();return `CD${String(d.getUTCFullYear()).slice(-2)}${String(d.getUTCMonth()+1).padStart(2,'0')}${String(d.getUTCDate()).padStart(2,'0')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;}
module.exports=async function handler(req,res){
 if(req.method!=='POST')return json(res,405,{error:'Método não permitido.'});
 const {STRIPE_SECRET_KEY,SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,STRIPE_PAYMENT_METHODS='card',DELIVERY_FEE_CENTS='0'}=process.env;
 if(!STRIPE_SECRET_KEY||!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY)return json(res,503,{error:'Pagamento ainda não foi configurado no servidor.'});
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};const items=Array.isArray(body.items)?body.items:[];
  const customer=body.customer||{};const delivery=body.delivery||{};
  if(body.ageConfirmed!==true)return json(res,403,{error:'É necessário declarar ter 18 anos ou mais para comprar bebidas alcoólicas.'});
  if(!customer.name||!customer.email||!customer.phone||!items.length)return json(res,400,{error:'Preencha seus dados e adicione ao menos uma cerveja.'});
  if(items.length>30)return json(res,400,{error:'Pedido acima do limite de itens.'});
  if(delivery.type==='delivery'){
    const a=delivery.address||{};
    if(!a.cep||!a.city||!a.street||!a.number||!a.district)return json(res,400,{error:'Preencha CEP, cidade, endereço, número e bairro para entrega.'});
  }
  const normalized=items.map(i=>({slug:String(i.slug||'').trim(),quantity:Math.max(1,Math.min(24,Number(i.quantity)||1))})).filter(i=>i.slug);
  const slugs=[...new Set(normalized.map(i=>i.slug))];
  const supabase=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
  const {data:beers,error:beerError}=await supabase.from('beers').select('id,slug,title,name,order_name,price,stock_status,stock_quantity,active').in('slug',slugs);
  if(beerError)throw beerError;if(!beers||beers.length!==slugs.length)return json(res,409,{error:'Um dos rótulos não está mais disponível.'});
  const map=new Map(beers.map(b=>[b.slug,b]));let subtotal=0;const lines=[];
  for(const item of normalized){const beer=map.get(item.slug);if(!beer||beer.active===false||beer.stock_status==='sold_out')return json(res,409,{error:`${beer?.title||item.slug} está esgotada.`});const price=Number(beer.price);if(!Number.isFinite(price)||price<=0)return json(res,409,{error:`${beer.title||beer.name} está sem preço para venda online.`});if(Number.isFinite(Number(beer.stock_quantity))&&Number(beer.stock_quantity)<item.quantity)return json(res,409,{error:`Estoque insuficiente de ${beer.title||beer.name}.`});subtotal+=price*item.quantity;lines.push({beer_id:beer.id,beer_slug:beer.slug,beer_name_snapshot:beer.order_name||beer.title||beer.name,unit_price:price,quantity:item.quantity,line_total:Number((price*item.quantity).toFixed(2))});}
  subtotal=Number(subtotal.toFixed(2));
  const deliveryFee=delivery.type==='delivery'?Math.max(0,Number.parseInt(DELIVERY_FEE_CENTS,10)||0)/100:0;
  const total=Number((subtotal+deliveryFee).toFixed(2));const code=orderCode();
  const {data:order,error:orderError}=await supabase.from('orders').insert({order_code:code,customer_name:String(customer.name).slice(0,120),customer_email:String(customer.email).slice(0,160),customer_phone:String(customer.phone).slice(0,30),delivery_type:delivery.type==='delivery'?'delivery':'pickup',delivery_address:delivery.type==='delivery'?delivery.address:null,notes:String(body.notes||'').slice(0,500),subtotal,delivery_fee:deliveryFee,total,status:'awaiting_payment',payment_status:'pending',age_verified:true,age_verified_at:new Date().toISOString()}).select('id,order_code').single();
  if(orderError)throw orderError;
  const {error:itemError}=await supabase.from('order_items').insert(lines.map(l=>({...l,order_id:order.id})));if(itemError)throw itemError;
  const stripe=new Stripe(STRIPE_SECRET_KEY);const origin=`${req.headers['x-forwarded-proto']||'https'}://${req.headers.host}`;const methods=STRIPE_PAYMENT_METHODS.split(',').map(s=>s.trim()).filter(Boolean);
  const stripeLines=lines.map(l=>({quantity:l.quantity,price_data:{currency:'brl',unit_amount:Math.round(l.unit_price*100),product_data:{name:l.beer_name_snapshot}}}));
  if(deliveryFee>0)stripeLines.push({quantity:1,price_data:{currency:'brl',unit_amount:Math.round(deliveryFee*100),product_data:{name:'Taxa de entrega'}}});
  const session=await stripe.checkout.sessions.create({mode:'payment',payment_method_types:methods.length?methods:['card'],customer_email:customer.email,client_reference_id:order.id,metadata:{order_id:order.id,order_code:code,age_verified:'true'},line_items:stripeLines,success_url:`${origin}/pedido-confirmado?pedido=${encodeURIComponent(code)}&session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/pedido-confirmado?pedido=${encodeURIComponent(code)}&status=cancelled`});
  await supabase.from('orders').update({stripe_checkout_session_id:session.id}).eq('id',order.id);
  return json(res,200,{url:session.url,orderCode:code});
 }catch(err){console.error(err);return json(res,500,{error:'Não foi possível criar o checkout. Tente novamente.'});}
};
