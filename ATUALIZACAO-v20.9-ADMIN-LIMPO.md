# v20.9 — Admin simplificado

## Cadastro/edição de cervejas
- Removido do formulário: Slug.
- Removido do formulário: Nome no pedido.
- Removido do formulário: Texto alternativo da imagem.
- Removido do formulário: Sinal do card.
- `Ordem` foi renomeado para `Posição no catálogo`.
- A Curadoria do Diegão permanece como seleção múltipla com:
  - Pra começar
  - Pra quem gosta de amargor
  - Fácil de beber
  - Pra sair da Pilsen
  - Escolhas do Diegão
  - Chegaram agora

## Automação interna
- Slug de cervejas existentes é preservado.
- Novas cervejas recebem slug automático pelo título/nome, com proteção contra duplicidade local.
- Nome no pedido é preenchido automaticamente com o título da cerveja.
- Texto alternativo é preenchido automaticamente com o título da cerveja.
- O antigo sinal é preservado em cervejas existentes e recebe 0 em novos cadastros.

Nenhuma alteração SQL é necessária.
