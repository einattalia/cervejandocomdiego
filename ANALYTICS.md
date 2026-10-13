# Estatísticas e relatórios do Cervejando com Diego

## Ativação

1. No SQL Editor do projeto Supabase, aplique primeiro `supabase-v20.9.20-controle-vendas.sql`, `supabase-v20.9.22-liquido-stripe.sql` e `supabase-v21-kits.sql`; depois execute `supabase-analytics.sql`.
2. Na Vercel, configure `GA4_MEASUREMENT_ID` com o ID da propriedade GA4 no formato `G-XXXXXXXXXX`.
3. Para enviar compras confirmadas pelo webhook à propriedade GA4, configure também `GA4_API_SECRET`. Crie o segredo na configuração do fluxo Web do GA4; mantenha-o somente nas variáveis privadas da Vercel.
4. Configure a variável privada `CRON_SECRET` na Vercel com pelo menos 16 caracteres aleatórios.
5. Execute `supabase-monthly-analytics-reports.sql` no SQL Editor.
6. Publique a aplicação e abra **Admin → Estatísticas e relatórios**.

As rotas `/api/track-analytics` e `/api/analytics-config.js` fazem o registro. `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já são variáveis usadas pelas APIs existentes. A chave de serviço e o segredo de GA4 ficam no servidor.

## Métricas

- **Visitas:** eventos `page_view` recebidos pelo Supabase.
- **Visitantes únicos:** UUID aleatório no navegador, sem guardar IP ou dados de contato.
- **Origem:** `utm_source` quando presente; caso contrário, domínio de referência ou acesso direto.
- **Produtos mais vistos:** card de produto visível em pelo menos 50% da área da tela.
- **Carrinhos abandonados:** sessão com produto adicionado, sem pagamento, sem atividade por 30 minutos. Pedidos pagos ou reembolsados pela Stripe são excluídos.
- **Conversão:** pedidos Stripe pagos (inclui reembolso parcial, exclui reembolso total e pagamentos de teste conhecidos) dividido por visitantes únicos.
- **Vendas confirmadas:** total pago menos reembolsos, baseado em `paid_at` e nos estados reconciliados da Stripe.

O navegador envia `page_view`, `view_item`, `add_to_cart` e `begin_checkout` ao GA4 e grava os próprios eventos no Supabase. Depois que o webhook confirma o pagamento, envia também `purchase` ao Supabase e, se o Measurement ID, o API Secret e o identificador do GA4 estiverem disponíveis, ao Measurement Protocol. A tela de sucesso do checkout não confirma pagamentos. Dados anteriores à instalação não são recriados.

## Relatórios

O painel permite exportar um CSV do intervalo selecionado, com resumo, série diária, origens de tráfego e produtos mais vistos. Os filtros **Este mês** e **Mês passado** também geram uma comparação com o período mensal anterior e pontos para acompanhar.

No primeiro dia de cada mês, o Vercel Cron salva um relatório do mês anterior, comparado ao mês precedente. Os últimos 12 relatórios ficam disponíveis no admin para baixar em CSV. O agendamento roda às 09:00 UTC (aproximadamente 06:00 no horário de Brasília); a Vercel pode executá-lo em qualquer momento dentro dessa hora.
