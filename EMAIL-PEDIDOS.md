# Confirmação do pedido por e-mail

Após o Stripe confirmar o pagamento, o site envia ao endereço informado no checkout uma mensagem com o número do pedido, cervejas e quantidades, componentes de kits e totais.

O envio usa o módulo Zoho SMTP já usado no site. As variáveis `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASSWORD`, `ZOHO_SMTP_HOST` e `ZOHO_SMTP_PORT` já estão configuradas no ambiente Production da Vercel. Mantenha a senha somente como variável secreta; não a coloque no código ou no repositório.
