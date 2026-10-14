# Atualização de kits — Cervejando com Diego

## O que mudou

- No admin, **Kits** permite ajustar a quantidade de copos e listar volumes disponíveis em ml.
- Um kit com tamanhos cadastrados mostra uma única foto e um seletor de tamanho na vitrine.
- A escolha do tamanho acompanha o pedido e é validada no servidor com os volumes salvos no banco.
- As quantidades de copos acompanham o componente de copo no estoque.

## Ativação

Antes de publicar os arquivos, execute novamente `supabase-v21-kits.sql` no SQL Editor do projeto Supabase usado pelo site. O arquivo adiciona os campos de forma compatível com a tabela existente e atualiza a função pública de catálogo. Os novos campos são `cup_quantity` e `cup_sizes_ml`.

Depois, publique a pasta inteira `Cervejando-com-Diego-kits-editaveis`, preservando a estrutura. A página de administração fica em `/admin`.

## Configurar “Atrás do Bloco”

1. Em **Kits**, mantenha uma ficha ativa para o produto.
2. Edite o nome, a descrição, o preço, os componentes e a quantidade de copos.
3. Carregue uma única foto no campo **Foto do kit**.
4. Em **Tamanhos disponíveis (ml)**, informe os tamanhos separados por vírgula (por exemplo, `300, 400`).
5. Desative as fichas duplicadas antigas, se houver, para deixar apenas uma arte e uma ficha com seletor de tamanho.

Os volumes e preços reais devem ser definidos pelo Diegão no admin; nenhum valor foi presumido nesta atualização.
