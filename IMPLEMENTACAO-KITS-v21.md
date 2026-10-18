# Construtor de Kits v21

O admin agora permite cadastrar vários kits fechados, com foto, descrição, preço de venda, custo por componente, margem e disponibilidade calculada. Componentes podem ser cervejas já cadastradas ou itens de estoque como copos, brindes e embalagens. O editor abre com uma cerveja e um componente não cervejeiro como ponto de partida; escolha o copo cadastrado para completar o primeiro kit.

## Ativação no Supabase

Antes de publicar os arquivos, execute `supabase-v21-kits.sql` uma vez no SQL Editor do projeto Supabase. O script cria o inventário e os kits, adiciona snapshots da composição nos itens de pedido, ativa RLS e atualiza `mark_order_paid` para descontar estoque de cervejas e demais componentes de forma idempotente.

O navegador público recebe somente dados de exibição e disponibilidade. Custos e composição interna permanecem restritos ao admin e ao servidor de checkout.

## Uso

1. No admin, abra **Kits** e cadastre um copo, brinde ou embalagem com estoque e custo.
2. Clique em **Criar kit**, mantenha uma cerveja com quantidade 1 e selecione o copo cadastrado com quantidade 1.
3. Informe o custo unitário da cerveja, preço final e foto. A margem bruta é calculada como `(preço − custo dos componentes) / preço`.
4. Salve o kit. Ele aparece como uma oferta pronta no catálogo público; o cliente adiciona o kit ao carrinho como uma única linha.

O servidor recalcula preço e estoque usando o Supabase; valores enviados pelo navegador não definem o preço pago. O webhook Stripe confirma o pagamento e chama `mark_order_paid`, que baixa os componentes registrados no snapshot daquele pedido. O checkout valida novamente o estoque antes de criar a sessão. A arquitetura de componentes permite acrescentar escolhas do cliente futuramente, mas nesta versão a composição é montada somente pelo admin.

Fotos usam o bucket público `beer-images` que o admin já utiliza para imagens de cerveja. Nenhuma nova chave ou credencial Stripe é necessária; a sessão de pagamento continua no Checkout hospedado do Stripe e usa os métodos habilitados na configuração da conta.
