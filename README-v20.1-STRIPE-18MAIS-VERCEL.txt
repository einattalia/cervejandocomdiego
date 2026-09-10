CERVEJANDO COM DIEGO — v20.1 — STRIPE + 18+

BASE VISUAL
- Reconstruído diretamente da v19.7 limpa.
- Tamanhos, pesos, espaçamentos, hero, cards, light/dark e responsividade da v19.7 foram preservados.
- Corrigido o carregamento da Cormorant Garamond, que já era referenciada no CSS da v19.7 mas não estava no link do Google Fonts.

18+
- Aviso legal no rodapé.
- Checkbox obrigatório no checkout.
- Botão de pagamento bloqueado até a confirmação.
- API também exige ageConfirmed=true (não é apenas validação visual).
- Supabase registra age_verified e age_verified_at.

STRIPE
- Valores dos produtos são lidos no servidor via Supabase.
- Checkout Session criada pela API /api/create-checkout-session.
- Webhook existente confirma pagamento e baixa estoque.
- Taxa de entrega opcional via DELIVERY_FEE_CENTS.

VERCEL — VARIÁVEIS
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PAYMENT_METHODS=card
DELIVERY_FEE_CENTS=0

BANCO
1) Se ainda não executou, rode supabase-v19-pedidos.sql.
2) Depois rode supabase-v20-stripe-18mais.sql.

CACHE/DEPLOY
- Versão marcada como 20.1.0.
- Scripts principais usam query string ?v=20.1.0.
- HTML/JS recebem cabeçalhos no-cache/no-store na Vercel para reduzir deploy antigo preso em cache.

IMPORTANTE
- Nunca coloque STRIPE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY no HTML/JS público.
- Confirme no painel Stripe se a conta pode processar venda de bebidas alcoólicas e quais métodos de pagamento estão habilitados.
