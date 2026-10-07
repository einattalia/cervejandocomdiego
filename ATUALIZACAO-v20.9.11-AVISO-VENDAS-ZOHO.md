# Atualização v20.9.11 — aviso de venda por e-mail

- Após a confirmação do pagamento pelo Stripe, o webhook envia um e-mail com os dados do pedido ao Diegão.
- Destinatário padrão: `contato@cervejandocomdiego.com.br`.
- O envio usa a conta Zoho da loja por SMTP seguro. O webhook aguarda o envio antes de responder ao Stripe; falhas são registradas e levam a uma resposta de erro para permitir nova tentativa.
- Também direciona o formulário de perguntas do site pelo Zoho.
- Permanecem ativos os botões e fluxos de contato/checkout pelo WhatsApp.
- Requer senha específica de aplicativo do Zoho nas variáveis da Vercel.
- Não exige alteração de schema no Supabase.
