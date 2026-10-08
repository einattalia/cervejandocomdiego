# v20.9.22 — Líquido real da Stripe

- O faturamento do Admin separa venda bruta, estornos, taxas Stripe e líquido após taxas.
- O líquido é calculado pelos `Balance Transactions` da Stripe (charge e estornos confirmados), sem estimar a tarifa por percentual.
- Checkout de teste (`cs_test_`) fica separado do faturamento real e não é conciliado usando chave de produção.
- A conciliação identifica o modo da chave e consulta apenas pedidos do mesmo ambiente.
- Se a taxa ainda não estiver disponível, o painel informa quantos pedidos precisam de conciliação e não apresenta uma estimativa como valor real.
- Novos pagamentos e estornos também gravam os dados financeiros quando a Stripe os disponibiliza.

## Aplicação

1. No SQL Editor do Supabase, execute o arquivo completo `supabase-v20.9.22-liquido-stripe.sql` uma vez. Ele adiciona os campos financeiros, classifica pedidos antigos pelo prefixo do Checkout Session e limpa divergências de sessões de teste.
2. Publique a versão v20.9.22 no Vercel.
3. No Admin, clique em **Conferir pagamentos**. A conciliação processa até 10 pedidos por clique, dos últimos 30 dias.

O valor líquido representa o impacto de pagamentos, taxas e estornos no saldo Stripe. Ele não é o valor de um repasse bancário específico, que pode agrupar vendas e ter outro calendário.
