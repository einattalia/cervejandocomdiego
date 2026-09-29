# v20.8 — Curadoria editável no Admin

No Admin > Cervejas > Editar/Nova cerveja foi incluído o campo **Curadoria do Diegão**.

Uma cerveja pode participar de várias seleções ao mesmo tempo:
- Pra começar
- Pra quem gosta de amargor
- Fácil de beber
- Pra sair da Pilsen
- Escolhas do Diegão
- Chegaram agora

As escolhas são salvas na tabela `beer_tags`, já existente. Portanto, **não é necessário rodar SQL novo** para esta versão.

As categorias técnicas antigas continuam armazenadas separadamente e seguem disponíveis para o quiz e demais regras internas.
