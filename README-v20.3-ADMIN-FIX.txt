CERVEJANDO COM DIEGO v20.3 — ADMIN FIX

Correções:
- Admin preservado a partir da versão estável v19.7.
- Caminhos do admin convertidos para absolutos (/admin/admin.css, /admin/admin.js, /assets/favicon.png).
- /admin e /admin/ apontam para o painel sem depender de barra final.
- Cache desativado para admin.js/admin.css.
- Carregamento dos módulos isolado: falha em Pedidos/Eventos/Configurações não derruba Cervejas.
- Stripe/18+ do front mantidos.

Após publicar, teste diretamente:
https://SEU-DOMINIO/admin

Se um módulo específico mostrar erro, o restante do painel deve continuar funcionando e a mensagem exibirá qual módulo/tabela falhou.
