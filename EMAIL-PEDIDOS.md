# Confirmação de pedido por e-mail

Depois que o Stripe confirmar o pagamento, o site envia ao e-mail informado no checkout uma confirmação com o número do pedido, as cervejas e quantidades compradas, o resumo dos kits e os totais.

O envio usa a conta Zoho configurada no servidor por SMTP. Mantenha as variáveis `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASSWORD`, `ZOHO_SMTP_HOST` e `ZOHO_SMTP_PORT` no ambiente Production da Vercel. Não coloque a senha no código nem no repositório.
