# v20.9.16 — Faturamento do admin

- O card de faturamento total soma todos os pedidos com pagamento confirmado.
- A nova área permite filtrar o faturamento por mês e ano, ou ver todos os meses/anos.
- O período inicial é o mês e ano atuais; datas são agrupadas no fuso de São Paulo e usam a data em que o pagamento foi confirmado.
- Pedidos pendentes, cancelados ou com pagamento falho não entram no total.
- A leitura percorre todas as páginas de pedidos pagos, sem ficar limitada aos 100 pedidos mostrados na lista do admin.
- A mudança é somente de leitura e não exige alteração no banco.

## Status automático do pedido

Quando o Stripe confirma o pagamento e o webhook configurado recebe o evento, a função `mark_order_paid` define `payment_status='paid'` e `status='paid'`. O admin atualiza a lista a cada 15 segundos enquanto a tela de pedidos está aberta. O webhook e a função SQL precisam estar publicados/configurados no ambiente de produção.

## Verificação

- `node --check admin/admin.js`
- Integridade do ZIP com `unzip -t`
- Filtros por período e total calculados sobre pedidos pagos.
