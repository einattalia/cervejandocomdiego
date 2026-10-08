# v20.9.20 — Controle real de vendas

## O que mudou

- O Admin passa a consultar todos os pedidos, sem limitar os indicadores aos 100 pedidos mais recentes.
- O painel separa pedidos pagos, pendentes, falhos/expirados, venda bruta, estornos e venda líquida.
- Eventos do webhook Stripe ficam registrados por ID; reenvios do mesmo evento não repetem baixa de estoque nem confirmação.
- O webhook registra falhas com mensagem e pedido relacionado, e permite reprocessar eventos que falharam.
- Pedidos de checkout expirados e pagamentos falhos recebem estado próprio.
- Estornos parciais e totais atualizam o valor estornado e o status do pedido.
- O painel mostra os últimos eventos Stripe com falha e atualiza a conciliação enquanto a visão geral está aberta.
- Um botão administrativo consulta checkouts recentes diretamente na Stripe para corrigir divergências mesmo quando um webhook não atualizou o pedido. A verificação processa até 10 pedidos por vez, com rechecagem de até 30 dias.
- Erros da conferência manual ficam gravados no pedido e aparecem junto das falhas do webhook no painel.

## Aplicação

1. Execute `supabase-v20.9.20-controle-vendas.sql` no SQL Editor do Supabase.
2. Publique o projeto atualizado para que o endpoint do webhook e o Admin usem a nova estrutura.
3. No Stripe Workbench, confirme que o endpoint está inscrito em `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired` e `charge.refunded`.
4. Abra **Webhooks → Event deliveries** e reenvie os eventos de pagamentos que falharam. O painel mostra as falhas recebidas pelo endpoint; o Workbench também mostra falhas de conexão ou assinatura antes de o evento ser registrado no banco.

O faturamento histórico não é reconstruído automaticamente apenas pela migração. Os eventos correspondentes devem ser reenviados para atualizar os pedidos já pagos.

## Regras de cálculo

- **Venda bruta:** soma do total dos pedidos com pagamento confirmado.
- **Estornos:** valor acumulado informado pela Stripe.
- **Venda líquida:** venda bruta menos estornos.
- Os filtros mensais usam a data de confirmação do pagamento.
- Venda líquida no Admin é diferente do repasse bancário líquido da Stripe, que pode incluir taxas e seguir outro calendário.
