CERVEJANDO COM DIEGO — v20.3.2

Correção pontual do painel Admin:
- Detecta automaticamente JWT/token expirado (incluindo "exp claim timestamp check failed").
- Renova a sessão usando refresh_token.
- Repete a operação original uma única vez após a renovação.
- Mantém login, catálogo, Stripe, 18+, Supabase e restante do projeto inalterados.

Se o navegador estiver com uma sessão antiga inválida já armazenada, saia do Admin e entre novamente uma vez após publicar esta versão.
