# Confirmação de pedido pelo WhatsApp

O site envia a confirmação depois que o Stripe confirma o pagamento. O cliente precisa aceitar receber a atualização no checkout. A mensagem traz o número do pedido e as cervejas, incluindo as cervejas que fazem parte de kits.

## Configuração necessária

No Meta Business, conecte um número à WhatsApp Business Platform (Cloud API) e crie um modelo de mensagem da categoria **Utility**, no idioma `pt_BR`, com três variáveis no corpo. Exemplo de texto:

```text
Olá, {{1}}! O pagamento do seu pedido {{2}} foi confirmado.

Cervejas compradas:
{{3}}

Obrigado por comprar com a gente!
```

Aguarde a aprovação do modelo pela Meta. Depois, adicione as variáveis abaixo ao ambiente **Production** do projeto Vercel `cervejandocomdiego`:

- `WHATSAPP_ACCESS_TOKEN`: token da Cloud API com permissão `whatsapp_business_messaging`.
- `WHATSAPP_PHONE_NUMBER_ID`: ID do número de telefone conectado.
- `WHATSAPP_ORDER_TEMPLATE_NAME`: nome do modelo aprovado (por exemplo, `pedido_confirmado`).
- `WHATSAPP_GRAPH_API_VERSION`: opcional; padrão `v27.0`.
- `WHATSAPP_ORDER_TEMPLATE_LANGUAGE`: opcional; padrão `pt_BR`.

Os três primeiros valores são necessários. Cadastre o token como variável secreta e não o envie pelo chat ou salve no repositório. Após configurar as variáveis, faça um novo deploy de produção. O envio sai pelo webhook Stripe apenas para pedidos pagos e com autorização registrada.
