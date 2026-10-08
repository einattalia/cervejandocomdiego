# Parceiros & Consignação — instalação

1. Faça backup do projeto e banco.
2. Execute **supabase-parceiros-consignacao.sql** no SQL Editor do mesmo projeto Supabase do site.
3. Publique os arquivos do projeto atualizado na Vercel/GitHub.
4. Entre no admin > Parceiros & Consignação, cadastre estabelecimentos e registre abastecimentos, vendas, devoluções, perdas e repasses.
5. O catálogo de cervejas já existente alimenta a seleção de rótulos. Informe o custo unitário real em cada abastecimento; sem esse custo o capital imobilizado será subestimado.

**Importante:** não foi executado SQL na conta real do Supabase e não houve publicação. Não há importação automática de estoque antigo: registre saldos iniciais como abastecimento, após conferência física. Os valores de repasse são calculados a partir das vendas lançadas manualmente; o sistema não recebe automaticamente vendas realizadas no caixa do estabelecimento. A coluna 'capital em estoque' usa o último custo informado no abastecimento para cada rótulo/parceiro (aproximação, não custo FIFO). Os lançamentos de movimentações e repasses são imutáveis para preservar histórico. Ajuste de inventário negativo: selecionar Ajuste e iniciar as observações com o caractere `-`. Comissão da venda é registrada com o percentual vigente do parceiro no momento do lançamento.

**Próxima etapa recomendada:** integração com fechamento de caixa dos parceiros, registro de lote/validade, inventário por contagem física e auditoria financeira por período.
