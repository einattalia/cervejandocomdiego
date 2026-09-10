CERVEJANDO COM DIEGO — v19 PEDIDOS + PAGAMENTO

O que entrou:
- checkout próprio no site;
- pedido gravado no Supabase antes do pagamento;
- área de pedidos preparada no Admin;
- estrutura de estoque por quantidade;
- pagamento seguro via Stripe Checkout;
- webhook para confirmar pagamento e baixar estoque;
- página /pedido-confirmado;
- WhatsApp mantido como alternativa.

ATIVAÇÃO (obrigatória para vender):
1. No Supabase > SQL Editor, execute supabase-v19-pedidos.sql.
2. Preencha stock_quantity das cervejas no Supabase.
3. Na Vercel > Project > Settings > Environment Variables, crie:
   SUPABASE_URL=https://cqtdrpwnjnetbcnuqtyv.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE_ROLE (NUNCA colocar no front)
   STRIPE_SECRET_KEY=SUA_CHAVE_SECRETA_STRIPE
   STRIPE_WEBHOOK_SECRET=SEGREDO_DO_WEBHOOK
   STRIPE_PAYMENT_METHODS=card
   Para habilitar Pix quando disponível/habilitado na conta: STRIPE_PAYMENT_METHODS=card,pix
4. No Stripe, cadastre um webhook apontando para:
   https://SEU-DOMINIO/api/stripe-webhook
   Eventos necessários:
   - checkout.session.completed
   - checkout.session.async_payment_succeeded
   - checkout.session.async_payment_failed
5. Faça novo deploy na Vercel.

IMPORTANTE:
- O valor é recalculado no servidor a partir do banco. O navegador não decide o preço.
- O navegador não marca pedido como pago. Apenas o webhook assinado faz isso.
- A SERVICE ROLE fica somente nas Environment Variables da Vercel.
- O checkout continua funcionando como catálogo/WhatsApp mesmo antes de configurar Stripe; o botão de pagamento exibirá que o servidor ainda não foi configurado.
