# v20.9.13 — Administração mobile

- O menu lateral do admin agora abre com um fundo de fechamento. Ele fecha ao tocar fora, selecionar uma seção, pressionar Escape ou voltar a uma tela larga.
- O estado do botão de menu acompanha a abertura e o fechamento para leitores de tela.
- A navegação e os principais botões têm áreas de toque maiores em telas pequenas.
- Ajustes de largura, quebra de texto, áreas seguras do celular e formulários de pedidos, eventos e Monte seu evento reduzem cortes e rolagem horizontal.

## Validação

- `node --check admin/admin.js`
- Leitura estrutural de `admin/index.html`

O pacote não publica as alterações por conta própria. Para aplicá-las no site, é necessário enviar os arquivos atualizados ao mesmo processo de hospedagem usado pelo projeto.
