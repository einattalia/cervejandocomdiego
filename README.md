# Cervejando com Diego

Guia principal do projeto. Este README descreve o conteúdo deste pacote e aponta para as notas detalhadas de cada atualização. Para entender a versão atual, comece aqui; os arquivos `ATUALIZACAO-*.md` e `FASE-*.md` registram mudanças específicas e históricas.

## Visão geral

O projeto reúne um catálogo público de cervejas, a geladeira interativa, curadoria e eventos, um painel administrativo e um checkout online. O front-end usa HTML, CSS e JavaScript; as APIs de pagamento e notificação rodam como funções da Vercel. Supabase guarda cervejas, estoque, pedidos, eventos e dados do painel. Stripe processa os pagamentos.

## Regras atuais do desconto Vitruviana

- Quando o campo **Cervejaria** contém “Vitruviana”, o catálogo mostra o selo **10% OFF**, o preço original riscado e o preço promocional.
- A geladeira não mostra o selo promocional.
- O carrinho não mostra chamada ou selo de desconto. O preço promocional continua compondo o total do pedido e é recalculado no servidor antes de criar a sessão da Stripe.
- A mensagem de pedido pelo WhatsApp não anuncia o desconto.
- O preço cadastrado no Admin continua sendo o preço original. Não é necessária migração SQL para essa regra.

Detalhes: [`ATUALIZACAO-DESCONTO-VITRUVIANA.md`](ATUALIZACAO-DESCONTO-VITRUVIANA.md).

## Recursos incluídos

### Loja e experiência pública

- Catálogo com busca, filtros, ficha dos rótulos, disponibilidade e preços.
- Geladeira interativa, curadoria e experiência de descoberta.
- Agenda Cervejeira, formulário “Monte seu evento” e calculadora de chopp.
- Carrinho, coleta de dados do cliente e escolha entre retirada e entrega.
- Declaração obrigatória de idade mínima de 18 anos antes da compra.
- Página de confirmação/cancelamento do pedido e opção de contato pelo WhatsApp.

### Admin e operação

- Login administrativo e gestão de cervejas, preços e estoque. A sessão Supabase é renovada antes de expirar; se o refresh token for inválido, o Admin pede novo login.
- Gestão de eventos e informativos de “Monte seu evento”.
- Lista de pedidos, atualização de pagamento pelo webhook e visão de faturamento/conciliação.
- Notificação por e-mail após confirmação de pagamento, quando o Zoho SMTP está configurado.

### Segurança e pagamentos

- O servidor consulta preço e estoque no Supabase; o navegador não define o valor cobrado.
- A API exige confirmação de maioridade e valida os itens disponíveis antes de abrir o checkout.
- O webhook Stripe valida a assinatura, registra eventos e atualiza o pedido após confirmação.
- Chaves privadas ficam somente nas variáveis de ambiente da Vercel. Nunca publique `STRIPE_SECRET_KEY` ou `SUPABASE_SERVICE_ROLE_KEY` no HTML, JavaScript ou repositório.

## Publicação na Vercel

1. Extraia o ZIP e publique a **pasta raiz do projeto**, que contém `index.html`, `vercel.json`, `package.json`, `api/`, `data/`, `assets/` e `admin/`.
2. Configure as variáveis de ambiente de acordo com a seção abaixo. Use **Production** e também **Preview** se for testar em previews.
3. Aplique no Supabase somente as migrações que ainda não foram executadas. Consulte a tabela de SQL e leia a nota correspondente antes de rodar um script. Não aplique todos os arquivos cegamente.
4. Configure o endpoint Stripe `https://SEU-DOMINIO/api/stripe-webhook` para receber os eventos indicados na nota de faturamento.
5. Faça o deploy e teste catálogo, acesso ao Admin, pedido de teste, confirmação de pagamento e atualização do pedido.

## Variáveis de ambiente

Configure os valores na Vercel. `.env.example` é apenas um modelo e não deve receber credenciais reais no Git.

| Variável | Uso |
| --- | --- |
| `SUPABASE_URL` | URL do projeto Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave privada usada somente pelas APIs de servidor. |
| `STRIPE_SECRET_KEY` | Chave secreta da conta Stripe correspondente ao ambiente. |
| `STRIPE_WEBHOOK_SECRET` | Segredo de assinatura do endpoint Stripe. |
| `STRIPE_PAYMENT_METHODS` | Métodos separados por vírgula; padrão do código: `card,pix`. O Pix também precisa estar habilitado na Stripe. |
| `DELIVERY_FEE_CENTS` | Taxa de entrega em centavos; opcional, padrão `0`. |
| `ZOHO_SMTP_HOST` | Host SMTP do Zoho; o exemplo usa `smtppro.zoho.com`. |
| `ZOHO_SMTP_PORT` | Porta SMTP; o exemplo usa `465`. |
| `ZOHO_SMTP_USER` | Conta Zoho que envia as mensagens. |
| `ZOHO_SMTP_PASSWORD` | Senha específica de aplicativo do Zoho. |
| `QUESTION_FROM_EMAIL` / `QUESTION_TO_EMAIL` | Remetente e destinatário do formulário de perguntas. |
| `ORDER_NOTIFICATION_FROM_EMAIL` / `ORDER_NOTIFICATION_TO_EMAIL` | Remetente e destinatário do aviso de venda confirmada; o destino padrão é `contato@cervejandocomdiego.com.br`. |

## Banco de dados e arquivos SQL

Os arquivos SQL estão na raiz do projeto. Antes de executar qualquer um, confira no Supabase se a migração correspondente já foi aplicada e siga a nota de versão relacionada.

| Arquivo | Finalidade / observação |
| --- | --- |
| `supabase-v19-pedidos.sql` | Estrutura base de pedidos e itens. |
| `supabase-v20-stripe-18mais.sql` | Campos e funções ligados ao checkout Stripe e verificação de idade. |
| `supabase-v19.1-eventos.sql` | Eventos e políticas associadas. |
| `supabase-monte-seu-evento.sql` | Conteúdo e configurações da área “Monte seu evento” e calculadora. |
| `supabase-v20.5-galeria-midias.sql` | Galeria/mídias de cervejas. |
| `supabase-v20.5.3-eventos-datas-instagram.sql` | Campos adicionais dos eventos. |
| `supabase-v20.9.18-fix-webhook-permission.sql` | Correção de permissão da função chamada pelo webhook. Idempotente; confira a nota v20.9.18. |
| `supabase-v20.9.20-controle-vendas.sql` | Registro de eventos Stripe e dados para conciliação e visão de vendas. Leia a nota v20.9.20 antes de aplicar. |
| `supabase-v20.9.8-whatsapp-notifications.sql` | Arquivo de uma implementação anterior de notificações WhatsApp; a automação foi removida da versão atual. Não aplique para ativar alertas de venda. |

O desconto Vitruviana não requer SQL. O histórico completo das exigências de cada recurso está nos arquivos de atualização listados abaixo.

## Notas de atualização incluídas

### Loja, checkout e operação

- [`ATUALIZACAO-DESCONTO-VITRUVIANA.md`](ATUALIZACAO-DESCONTO-VITRUVIANA.md) — desconto e apresentação no catálogo.
- [`ATUALIZACAO-PIX-CHECKOUT.md`](ATUALIZACAO-PIX-CHECKOUT.md) — Pix no checkout Stripe.
- [`ATUALIZACAO-v20.9.11-AVISO-VENDAS-ZOHO.md`](ATUALIZACAO-v20.9.11-AVISO-VENDAS-ZOHO.md) — aviso de venda confirmada por e-mail.
- [`ATUALIZACAO-v20.9.12-STATUS-PEDIDO-AUTOMATICO.md`](ATUALIZACAO-v20.9.12-STATUS-PEDIDO-AUTOMATICO.md) — atualização automática do status.
- [`ATUALIZACAO-v20.9.16-FATURAMENTO-ADMIN.md`](ATUALIZACAO-v20.9.16-FATURAMENTO-ADMIN.md) — faturamento no Admin.
- [`ATUALIZACAO-v20.9.18-WEBHOOK-FATURAMENTO.md`](ATUALIZACAO-v20.9.18-WEBHOOK-FATURAMENTO.md) — permissão do webhook.
- [`ATUALIZACAO-v20.9.20-CONTROLE-REAL-VENDAS.md`](ATUALIZACAO-v20.9.20-CONTROLE-REAL-VENDAS.md) — eventos, estornos e conciliação.
- [`ATUALIZACAO-v20.9.21-CORRECAO-CONCILIACAO-STRIPE.md`](ATUALIZACAO-v20.9.21-CORRECAO-CONCILIACAO-STRIPE.md) — chamada da API de conciliação.
- [`ATUALIZACAO-v20.9.9-SEM-AVISO-WHATSAPP.md`](ATUALIZACAO-v20.9.9-SEM-AVISO-WHATSAPP.md) — registra que o aviso automático pelo WhatsApp foi removido.
- [`ATUALIZACAO-AVISO-VENDAS-WHATSAPP.md`](ATUALIZACAO-AVISO-VENDAS-WHATSAPP.md) — nota histórica supersedida; não representa a configuração atual.

### Admin, conteúdo e eventos

- [`ATUALIZACAO-v20.8-CURADORIA-ADMIN.md`](ATUALIZACAO-v20.8-CURADORIA-ADMIN.md) — seleções da Curadoria do Diegão.
- [`ATUALIZACAO-v20.9-ADMIN-LIMPO.md`](ATUALIZACAO-v20.9-ADMIN-LIMPO.md) — simplificação do cadastro de cervejas.
- [`ATUALIZACAO-v20.9.13-ADMIN-MOBILE.md`](ATUALIZACAO-v20.9.13-ADMIN-MOBILE.md) — login e usabilidade mobile.
- [`ATUALIZACAO-SESSAO-ADMIN-SUPABASE.md`](ATUALIZACAO-SESSAO-ADMIN-SUPABASE.md) — renovação da sessão e tratamento de JWT expirado.
- [`ATUALIZACAO-v20.9.17-CORRECAO-MODULOS-ADMIN.md`](ATUALIZACAO-v20.9.17-CORRECAO-MODULOS-ADMIN.md) — inicialização dos módulos do Admin.
- [`ATUALIZACAO-FESTAS-E-EVENTOS.md`](ATUALIZACAO-FESTAS-E-EVENTOS.md) — Agenda Cervejeira e formulário.
- [`ATUALIZACAO-MONTE-SEU-EVENTO-v20.9.4.md`](ATUALIZACAO-MONTE-SEU-EVENTO-v20.9.4.md) — conteúdo editável, galeria e calculadora.
- [`ATUALIZACAO-CALCULADORA-CHOPP-v20.9.5.md`](ATUALIZACAO-CALCULADORA-CHOPP-v20.9.5.md) — parâmetros e estimativa de litros.
- [`ATUALIZACAO-v20.9.6-FIX-VISUALIZACAO-CALCULADORA.md`](ATUALIZACAO-v20.9.6-FIX-VISUALIZACAO-CALCULADORA.md) — exibição da calculadora no Admin.

### Experiência visual

- [`FASE-1-ANIMACOES.md`](FASE-1-ANIMACOES.md), [`FASE-2-ANIMACOES.md`](FASE-2-ANIMACOES.md) e [`FASE-3-ANIMACOES.md`](FASE-3-ANIMACOES.md) — sistema de movimento e geladeira interativa.
- [`FASE-3.1-PRATELEIRA-DESCOBERTA.md`](FASE-3.1-PRATELEIRA-DESCOBERTA.md) — descoberta e filtros.
- [`FASE-3.2-SEM-FUNDO-ROTULOS.md`](FASE-3.2-SEM-FUNDO-ROTULOS.md), [`FASE-3.3-ALINHAMENTO-PRATELEIRA.md`](FASE-3.3-ALINHAMENTO-PRATELEIRA.md) e [`FASE-3.4-CURSOR-CONTEXTUAL.md`](FASE-3.4-CURSOR-CONTEXTUAL.md) — refinamentos visuais.

## Outros arquivos de referência

- [`COMO-EDITAR-CERVEJAS.txt`](COMO-EDITAR-CERVEJAS.txt) — cadastro e edição de cervejas.
- [`STRIPE-PRODUCAO-v20.9.3.txt`](STRIPE-PRODUCAO-v20.9.3.txt) — referência histórica de produção Stripe; confira as variáveis na Vercel antes de usar.

## Observações

- As notas de atualização descrevem o escopo da mudança quando foram escritas; podem conter instruções de implantação específicas daquela versão.
- A automação de venda por WhatsApp descrita na nota histórica correspondente não está ativa. O aviso de venda atual é por e-mail via Zoho quando as credenciais estão configuradas.
- Esta documentação não confirma quais migrações já foram executadas no Supabase nem quais variáveis estão configuradas no projeto Vercel.
