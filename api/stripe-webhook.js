const Stripe=require('stripe');
const {createClient}=require('@supabase/supabase-js');
module.exports.config={api:{bodyParser:false}};
async function rawBody(req){const chunks=[];for await(const chunk of req)chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk));return Buffer.concat(chunks);}
module.exports=async function handler(req,res){
 if(req.method!=='POST'){res.statusCode=405;return res.end('Method not allowed');}
 const {STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY}=process.env;
 if(!STRIPE_SECRET_KEY||!STRIPE_WEBHOOK_SECRET||!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY){res.statusCode=503;return res.end('Webhook not configured');}
 try{const stripe=new Stripe(STRIPE_SECRET_KEY);const body=await rawBody(req);const sig=req.headers['stripe-signature'];const event=stripe.webhooks.constructEvent(body,sig,STRIPE_WEBHOOK_SECRET);const supabase=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
  if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){const session=event.data.object;const orderId=session.metadata?.order_id||session.client_reference_id;if(orderId){const {error}=await supabase.rpc('mark_order_paid',{p_order_id:orderId,p_payment_provider:'stripe',p_payment_reference:session.payment_intent||session.id});if(error)throw error;}}
  if(event.type==='checkout.session.async_payment_failed'){const session=event.data.object;const orderId=session.metadata?.order_id||session.client_reference_id;if(orderId)await supabase.from('orders').update({payment_status:'failed'}).eq('id',orderId);}
  res.statusCode=200;res.end('ok');
 }catch(err){console.error(err);res.statusCode=400;res.end(`Webhook Error: ${err.message}`);}
};