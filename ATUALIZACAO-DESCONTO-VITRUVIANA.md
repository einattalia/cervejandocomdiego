# Desconto Vitruviana — 10%

- O catálogo identifica os rótulos quando o campo **Cervejaria** contém “Vitruviana”.
- As latas recebem o selo **10% OFF** no catálogo e na geladeira do site.
- O preço original aparece riscado e o valor promocional é calculado automaticamente.
- Carrinho, resumo do checkout, Stripe e mensagem de pedido pelo WhatsApp usam ou informam o valor com desconto.
- O preço cadastrado no admin permanece como preço original; não é necessário alterar os dados nem executar SQL.

Para que o desconto seja aplicado, mantenha “Vitruviana” no campo **Cervejaria** de cada rótulo participante.
