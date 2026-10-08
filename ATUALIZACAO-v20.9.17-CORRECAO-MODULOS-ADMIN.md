# v20.9.17 — Correção de carregamento dos módulos

- O faturamento atualiza o total acumulado mesmo se os controles de período estiverem ausentes por HTML em cache ou publicação parcial; os filtros são ativados quando a versão correspondente do HTML está publicada.
- Os eventos de mudança dos filtros usam seletores opcionais para não interromper a inicialização do admin.
- Os valores padrão da calculadora foram movidos para o início do script para evitar referência antes da inicialização.
- Atualizados os identificadores de cache do CSS e JavaScript. Envie o projeto completo para manter HTML, CSS e JavaScript sincronizados.

## Verificação

- `node --check admin/admin.js`
- Validação do HTML e dos IDs dos filtros de faturamento.
- ZIP íntegro com `unzip -t`.
