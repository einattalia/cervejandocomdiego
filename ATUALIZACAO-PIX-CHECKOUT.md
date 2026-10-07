# Pix no checkout — atualização

O Stripe já está com Pix habilitado. A API do site agora usa `card,pix` como padrão ao criar a sessão do Checkout, e o webhook já trata a confirmação assíncrona do pagamento.

## Publicação na Vercel

1. Em **Project → Settings → Environment Variables**, localize `STRIPE_PAYMENT_METHODS`.
2. Defina o valor como `card,pix` para **Production** (e para Preview, se também for testar por lá).
3. Salve e faça um novo deploy.
4. Confira que a sessão de pagamento está em reais (BRL) e teste uma compra.

Se a variável não existir, o padrão do código já será `card,pix`. Não é necessário alterar o banco/Supabase nem cadastrar novos eventos de webhook: os eventos `checkout.session.completed`, `checkout.session.async_payment_succeeded` e `checkout.session.async_payment_failed` já são tratados.
