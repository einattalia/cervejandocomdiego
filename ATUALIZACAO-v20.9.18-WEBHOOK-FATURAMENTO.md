# v20.9.18 — Permissão do webhook e faturamento

- O webhook do Stripe usa `service_role` para chamar `public.mark_order_paid`.
- A função havia sido revogada de `PUBLIC`, `anon` e `authenticated`, mas faltava conceder execução a `service_role`. Sem essa permissão, o webhook falha e o pedido pode continuar com `payment_status='pending'`, deixando o faturamento confirmado zerado.
- A permissão foi adicionada ao SQL principal e também está disponível como correção isolada em `supabase-v20.9.18-fix-webhook-permission.sql`.
- A correção isolada é idempotente e não altera dados; ela concede execução apenas a `service_role`.

## Aplicação

Execute o arquivo `supabase-v20.9.18-fix-webhook-permission.sql` no SQL Editor do Supabase. Depois, reenvie pela Stripe os eventos de pagamento que falharam, se eles não forem reenviados automaticamente.

## Verificação local

- `node --check api/stripe-webhook.js`
- Revisão do SQL: `PUBLIC`, `anon` e `authenticated` permanecem sem EXECUTE; `service_role` recebe EXECUTE.
