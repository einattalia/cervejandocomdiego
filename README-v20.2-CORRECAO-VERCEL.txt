CERVEJANDO COM DIEGO — v20.2
CORREÇÃO DE DEPLOY VERCEL + STRIPE + 18+

Base visual: v19.7.

O que foi corrigido nesta versão:
1. Tipografia restaurada exatamente ao carregamento da v19.7. Nenhuma nova fonte foi adicionada.
2. CSP do vercel.json corrigida. A regra anterior bloqueava scripts inline depois das alterações do HTML.
3. Cache busting atualizado para v20.2.0.
4. Validação 18+ permanece obrigatória no checkout e no servidor.
5. Stripe Checkout, webhook, pedidos e estoque permanecem.

IMPORTANTE PARA PUBLICAR NA VERCEL:
- Extraia o ZIP e publique A PASTA RAIZ que contém index.html, vercel.json, package.json, api/, data/, assets/ e admin/.
- Não publique a pasta pai contendo outra pasta do projeto.
- Em Project Settings > Environment Variables configure:
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  STRIPE_PAYMENT_METHODS=card
  DELIVERY_FEE_CENTS=0
- Rode supabase-v20-stripe-18mais.sql no SQL Editor do Supabase.
- Depois faça Redeploy na Vercel sem reutilizar build cache, se essa opção estiver disponível.
