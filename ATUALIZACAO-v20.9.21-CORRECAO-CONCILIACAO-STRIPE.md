# v20.9.21 — Correção da conciliação Stripe

- O botão **Conferir pagamentos** agora chama `/api/reconcile-stripe` no domínio do próprio site (Vercel).
- A chamada envia o token da sessão administrativa no cabeçalho `Authorization`.
- A requisição REST do Supabase continua sendo usada apenas para dados do banco; a rota de conciliação não é mais enviada ao host do Supabase.
- Erros HTTP do endpoint passam a exibir a mensagem retornada pelo servidor. Falhas de conexão informam que a API do site pode não estar publicada.

## Publicação

1. Publique esta versão no projeto Vercel conectado ao domínio do site.
2. Execute uma vez a migração `supabase-v20.9.20-controle-vendas.sql`, caso ainda não tenha sido executada. A atualização v20.9.21 não exige nova alteração de banco.
3. No Admin, abra **Visão geral** e clique em **Conferir pagamentos**.

