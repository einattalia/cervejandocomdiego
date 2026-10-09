> **Nota histórica:** esta implementação foi substituída. A automação de venda pelo WhatsApp foi removida na v20.9.9; na versão atual, o aviso de venda confirmada é enviado por e-mail via Zoho quando configurado. Não siga estas instruções para ativar alertas de venda. Consulte o [README principal](README.md) e `ATUALIZACAO-v20.9.9-SEM-AVISO-WHATSAPP.md`.

# Aviso automático de venda confirmada no WhatsApp

O webhook do Stripe agora chama a WhatsApp Business Cloud API da Meta depois de confirmar o pagamento. O envio vale para pedidos pagos com Pix ou cartão, e um registro no Supabase evita avisos duplicados quando o Stripe repete a entrega do webhook.

## Antes de ativar

1. No Meta WhatsApp Manager, crie o template `nova_venda_confirmada`, idioma `pt_BR`, com o corpo abaixo e aguarde aprovação:

   🍻 Nova venda confirmada!
   Pedido: {{1}}
   Cliente: {{2}}
   WhatsApp: {{3}}
   Itens:
   {{4}}
   Total: {{5}}
   {{6}}
   ✅ Pagamento confirmado no Stripe.

2. No Supabase, execute `supabase-v20.9.8-whatsapp-notifications.sql` no SQL Editor.
3. Na Vercel, em **Project → Settings → Environment Variables**, adicione para **Production**:
   - `WHATSAPP_ACCESS_TOKEN`: token de acesso da Meta (segredo).
   - `WHATSAPP_PHONE_NUMBER_ID`: ID do número remetente cadastrado na Cloud API.
   - `WHATSAPP_RECIPIENT_NUMBER`: número do Diegão, com país e DDD, apenas dígitos (ex.: `5516999999999`).
   - `WHATSAPP_ORDER_TEMPLATE_NAME`: `nova_venda_confirmada`.
   - `WHATSAPP_TEMPLATE_LANGUAGE`: `pt_BR`.
   - `WHATSAPP_GRAPH_API_VERSION`: `v26.0`.
4. Salve e faça um novo deploy para aplicar as variáveis.
5. Teste uma compra de ponta a ponta e confirme o pagamento no Stripe; a mensagem só é disparada após o status pago.

O template recebe, nesta ordem: código do pedido, nome, telefone, resumo dos itens, total e entrega/retirada. O endereço aparece quando a modalidade for entrega.

Se as variáveis da Meta não estiverem configuradas, o webhook continua processando a confirmação do pagamento e registra um aviso no log; a notificação não é enviada. O webhook já processa os eventos Stripe `checkout.session.completed` e `checkout.session.async_payment_succeeded`.
