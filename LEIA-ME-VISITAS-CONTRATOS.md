# Parceiros: contratos e visitas quinzenais

1. Faça backup do banco e do site.
2. No Supabase SQL Editor, execute **supabase-visitas-contratos.sql** após a migração original de consignação.
3. Publique os arquivos atualizados na Vercel.
4. Admin → Parceiros & Consignação → **Abrir painel** no estabelecimento.
5. No painel do estabelecimento, anexe o contrato (PDF, PNG, JPG, DOC ou DOCX; até 10 MB), visualize-o com link temporário, e registre as visitas.
6. Para a visita, primeiro faça o abastecimento inicial usando **Abastecer / movimentar**. Na conferência, digite o estoque físico encontrado por rótulo. A diferença é contabilizada como venda. O repasse usa a participação do estabelecimento cadastrada.
7. Informe o dinheiro efetivamente recebido, não o total de vendas. A diferença fica pendente.

**Regras:** visita grava venda, recebimento e resumo em uma transação no Supabase. Se a contagem superar o saldo esperado, registre abastecimento antes; se houver devolução ou avaria, registre a movimentação separadamente. O módulo não deduz vendas automaticamente sem a visita. A visita não deve ser lançada duas vezes. Contratos ficam em bucket privado com políticas administrativas.

**Atenção:** implementação preparada e validada quanto à sintaxe JavaScript e integridade ZIP, mas sem teste conectado ao banco de produção. Faça uma visita de teste com um parceiro antes de usar dados financeiros reais.
