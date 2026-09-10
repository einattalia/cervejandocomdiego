CERVEJANDO COM DIEGO — v20 STRIPE + 18+

Base: v19.7 TIPOGRAFIA HERO. Nenhum ajuste visual aprovado foi removido.

NOVO FLUXO
Catálogo > Carrinho > Finalizar compra > dados do cliente > retirada/entrega > confirmação obrigatória 18+ > Stripe Checkout > webhook > pedido pago > baixa automática de estoque > painel Admin.

ALTERAÇÕES
- aviso 18+ discreto no rodapé;
- aviso 18+ no carrinho;
- checkbox obrigatório de maioridade antes do pagamento;
- botão de pagamento fica bloqueado até a confirmação;
- backend também exige ageConfirmed=true (não depende só do navegador);
- pedido registra age_verified e age_verified_at;
- checkout Stripe calcula preços a partir do Supabase, nunca do navegador;
- retirada ou entrega;
- entrega coleta CEP, cidade, rua, número, bairro e complemento;
- DELIVERY_FEE_CENTS permite taxa fixa de entrega;
- Stripe Checkout com cartão e possibilidade de Pix quando habilitado na conta;
- webhook assinado confirma pagamento e baixa estoque;
- status do estoque muda automaticamente para in_stock / low_stock / sold_out;
- painel Admin existente continua com Pedidos, Pagos e Faturamento;
- WhatsApp continua como alternativa.

ATIVAÇÃO NO SUPABASE
1. Abra SQL Editor.
2. Execute supabase-v20-stripe-18mais.sql.
3. Em beers, preencha price e stock_quantity dos rótulos que serão vendidos online.

ATIVAÇÃO NA VERCEL
Em Project > Settings > Environment Variables crie:
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PAYMENT_METHODS=card
DELIVERY_FEE_CENTS=0
Depois faça Redeploy.

ATIVAÇÃO NA STRIPE
1. Crie/valide a conta comercial.
2. Use primeiro as chaves de TESTE.
3. Developers > Webhooks > Add endpoint.
4. URL: https://SEU-DOMINIO/api/stripe-webhook
5. Eventos:
   checkout.session.completed
   checkout.session.async_payment_succeeded
   checkout.session.async_payment_failed
6. Copie o Signing secret (whsec_...) para STRIPE_WEBHOOK_SECRET na Vercel.
7. Teste o fluxo completo antes de trocar sk_test por sk_live.

SEGURANÇA
- Nunca coloque STRIPE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY em HTML/JS público.
- O valor final é recalculado no servidor usando o preço do banco.
- Somente webhook assinado marca o pedido como pago.
- A confirmação 18+ é validada no front e no backend e registrada no pedido.

OBSERVAÇÃO LEGAL
O projeto exibe: “Venda proibida para menores de 18 anos. Beba com moderação.”
O checkbox é uma declaração do comprador. Avalie requisitos locais adicionais para venda, entrega e conferência documental de bebidas alcoólicas antes da operação comercial.
