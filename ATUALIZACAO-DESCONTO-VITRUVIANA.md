# Desconto Vitruviana — 10%

- O catálogo identifica os rótulos quando o campo **Cervejaria** contém “Vitruviana”.
- O selo **10% OFF**, o preço original riscado e o preço promocional aparecem no catálogo.
- A geladeira e o carrinho não exibem selo nem chamada de desconto.
- O preço promocional continua valendo no carrinho, no checkout, na Stripe e no total do pedido; a mensagem de WhatsApp não anuncia o desconto.
- O preço cadastrado no admin permanece como preço original; não é necessário alterar os dados nem executar SQL.

Para que o desconto seja aplicado, mantenha “Vitruviana” no campo **Cervejaria** de cada rótulo participante.
