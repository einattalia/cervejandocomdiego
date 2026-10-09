# Cervejando com Diego — Documentação do Projeto

Este arquivo consolida os READMEs que acompanhavam o projeto até a versão **v20.5.9**.

> **Importante:** este arquivo é apenas documentação. O funcionamento do site continua dependendo dos arquivos de aplicação, APIs, configurações e variáveis de ambiente do projeto.

## Índice rápido

- Configurações e instruções acumuladas das versões anteriores
- Supabase / banco de dados e painel administrativo
- Stripe / pagamentos
- Vercel / publicação e variáveis de ambiente
- Formulário “Pergunte pro Diegão” / Resend
- Histórico e observações técnicas

---


## Documento original: `README-FINAL.txt`

CERVEJANDO COM DIEGO — FINAL VITRINE
- Geladeira slim premium em HTML/CSS.
- 9 latas reais em 3x3 com os arquivos enviados.
- Clique nas latas da geladeira abre as fichas.
- Cada ficha tem "Quero essa no WhatsApp".
- Instagram e WhatsApp clicáveis.
- ZEV permanece no catálogo, mas não na geladeira de 9 latas.

Versão atualizada: carrinho responsivo, continuar comprando retorna ao catálogo e checkout envia itens selecionados ao WhatsApp do Diegão.

---

## Documento original: `README-PRODUCAO.txt`

CERVEJANDO COM DIEGO — PRODUÇÃO FINAL

PUBLICAÇÃO NO NETLIFY DROP
Arraste a pasta inteira: Cervejando-com-Diego-PRODUCAO-FINAL
O arquivo index.html deve permanecer na raiz, ao lado da pasta assets.

URL de produção configurada nas tags sociais:
https://cervejandocomdiego.netlify.app/

Imagem Open Graph:
https://cervejandocomdiego.netlify.app/assets/compartilhamento-de-link.jpg

Observação: se o seu domínio/URL final do Netlify for diferente de https://cervejandocomdiego.netlify.app, substitua somente SITE/og:url/og:image/twitter:image no <head> pelo endereço definitivo antes de publicar. O Netlify Drop pode criar um subdomínio diferente quando o site ainda não tem domínio fixo.

Principais mudanças:
- Open Graph e Twitter Card completos.
- Imagem social 1200x630 sem deformar ou cortar o conteúdo principal.
- Favicon separado da imagem de compartilhamento.
- Geladeira com quatro latas em composição 2x2.
- Instagram e WhatsApp com SVGs reconhecíveis, links seguros e aria-label.
- Nomes/estilos das cervejas em amarelo ouro.
- Botões dos modais: Adicionar ao carrinho.
- Revisão mobile para 320/360/375/390/414px e tablets.
- Carrinho responsivo preservado.

---

## Documento original: `README-v17.13-PREMIUM.txt`

Cervejando com Diego — v17.13 Premium

Alteração desta versão:
- Alternância de tema escuro/claro por botão Sol/Lua no header, ao lado do carrinho.
- Tema claro premium em marfim, carvão e latão, preservando a identidade visual.
- Preferência de tema persistida no navegador.
- Controle responsivo e acessível no mobile.
- Geladeira preservada escura nos dois temas para manter contraste e caráter premium.

---

## Documento original: `README-v17.2-PREMIUM.txt`

CERVEJANDO COM DIEGO — v17.2 PREMIUM

Base: v17.1 Catálogo + Supabase.

Direção visual aplicada:
- Hero mais editorial, com maior respiro e CTA de entrada no catálogo.
- Tipografia display Cormorant Garamond para títulos, mantendo Poppins na leitura.
- Paleta preto carvão + dourado envelhecido, com contraste mais sofisticado.
- Textura/granulação sutil no fundo.
- Geladeira hero refinada e reorganizada em 2x2 com 4 rótulos em destaque.
- Manifesto de marca entre hero e catálogo: “Menos quantidade. Mais escolha.”
- Cards do catálogo refinados com bordas, hierarquia, microinterações e acabamento mais discreto.
- Microinterações suaves e redução de efeitos visuais excessivos.
- Chuva de lúpulos desativada para manter estética premium.
- Seções “Pergunte pro Diegão”, “Como funciona” e “Sobre” redesenhadas no mesmo sistema visual.
- Copy da seção Sobre revisada, sem emojis.

Mantido:
- Supabase como fonte do catálogo com fallback local.
- Busca, filtros, preço, volume, intensidade, amargor e status de estoque.
- Latas 3D no catálogo.
- Modais e carrinho.
- Checkout pelo WhatsApp.
- Segurança/CSP/headers Netlify.

Deploy: arraste o ZIP NETLIFY no deploy manual do site existente.

---

## Documento original: `README-v17.3-PREMIUM.txt`

Cervejando com Diego — v17.3 Premium

Base: v17.2 Premium.

Ajustes:
- Intensidade e amargor nos cards em barras segmentadas de 5 níveis.
- Nível numérico (x/5) e descrição textual em cada indicador.
- Intensidade em acabamento dourado; amargor em cobre/âmbar.
- Tags/filtros mantidos.
- Busca por rótulo ou cervejaria sempre pesquisa o catálogo completo, independentemente da tag ou filtro selecionado.
- Ao apagar a busca, o filtro selecionado volta a ser aplicado.
- Supabase, checkout WhatsApp, carrinho, modais e navegação preservados.

---

## Documento original: `README-v17.4-PREMIUM.txt`

Cervejando com Diego — v17.4 Premium

Ajustes desta versão:
- Intensidade e amargor em layout horizontal nos cards.
- Escalas segmentadas mantidas em 5 níveis.
- Layout responsivo refinado para tablets e celulares, inclusive telas estreitas.
- Texto da seção Sobre atualizado para a nova copy aprovada.
- Fechamento “Um brinde à cultura cervejeira.” destacado como assinatura.
- Busca global e filtros da v17.3 preservados.
- Supabase, carrinho e checkout via WhatsApp preservados.

---

## Documento original: `README-v17.6-PREMIUM.txt`

Cervejando com Diego — v17.6 Premium

Ajustes desta versão:
- Escalas de Intensidade e Amargor refeitas para permanecer sempre na horizontal em desktop, tablet e mobile.
- Cada escala agora usa: rótulo + 5 segmentos horizontais + leitura “x/5 · descrição”.
- Geladeira recuada levemente para a esquerda no desktop, aproximando-a do texto sem comprometer o respiro do hero.
- Título da seção “Quem faz a curadoria” alterado para duas linhas: “Cervejando” / “com Diego”.
- Mantidos Supabase, filtros, busca global, galeria de fotos, carrinho e checkout via WhatsApp.

---

## Documento original: `README-v17.7-PREMIUM.txt`

Cervejando com Diego — v17.7 Premium

Ajuste desta versão:
- Indicadores de Intensidade e Amargor voltaram a usar bolinhas.
- As 5 bolinhas permanecem sempre lado a lado, na horizontal, no desktop e no mobile.
- Intensidade usa preenchimento dourado e amargor usa preenchimento cobre/âmbar.
- Mantidos Supabase, filtros, busca global, carrinho e checkout por WhatsApp.

---

## Documento original: `README-v17.9-PREMIUM.txt`

Cervejando com Diego — v17.9 Premium

Correção pontual dos cards:
- Intensidade e Amargor travados em uma única linha horizontal.
- Ordem fixa: rótulo → 5 bolinhas → valor/descrição.
- Bolinhas nunca mudam para coluna, inclusive em telas mobile.
- Cores mantidas: dourado para intensidade e cobre/âmbar para amargor.

---

## Documento original: `README-v18-ADMIN.txt`

CERVEJANDO COM DIEGO — v18 ADMIN

Base: v17.13 Premium.
Novo painel: /admin/
Backend: Supabase Auth + Postgres + Storage + RLS.
Primeiro e-mail de teste autorizado: ameninadovideo016@gmail.com

PRIMEIRO ACESSO
1. Publique este projeto no Netlify.
2. Abra /admin/.
3. Digite uma senha com no mínimo 6 caracteres e clique em "Criar primeiro acesso de teste".
4. Se a confirmação de e-mail estiver habilitada no Supabase, confirme o e-mail recebido.
5. Volte ao /admin/ e faça login.

O painel permite gerenciar cervejas, preço, estoque, categorias, imagens e configurações.
A chave presente no navegador é a chave PUBLICÁVEL do Supabase, não uma chave secreta.

---

## Documento original: `README-v18.1-ADMIN.txt`

CERVEJANDO COM DIEGO — v18.1 ADMIN

Correção do painel administrativo:
- imagens locais cadastradas como assets/... agora são resolvidas a partir da raiz /assets/...
- URLs completas do Supabase Storage continuam funcionando normalmente
- fallback para o favicon caso uma imagem esteja indisponível
- preview do editor usa a mesma resolução de caminho

Base: v18 Admin / v17.13 Premium.

---

## Documento original: `README-v18.2-ADMIN.txt`

CERVEJANDO COM DIEGO — v18.2 ADMIN

Ajustes desta versão:
- Cards mobile alinhados e com mesma altura, inclusive no tema claro.
- Tema claro com bege predominante mais escuro.
- Fotos do Diegão preenchendo integralmente o quadro, sem bordas/faixas.
- Painel administrativo liberado após login autenticado no desktop e mobile.
- Modal mobile com rolagem e especificações de cerveja sempre visíveis.
- Mantidas integrações Supabase, carrinho, filtros, tema e estrutura Netlify.

---

## Documento original: `README-v18.3-ADMIN.txt`

CERVEJANDO COM DIEGO — v18.3 ADMIN

Ajustes:
- Tema claro em bege/mostarda mais escuro com transparência.
- Cards mobile alinhados e com altura uniforme no tema claro.
- Foto do Diegão preenche totalmente o quadro, sem bordas aparentes.
- Painel admin protegido: conteúdo só abre após sessão válida + conta autorizada.
- Removido botão público de criação de primeiro acesso.
- Editor e especificações das cervejas totalmente visíveis no admin mobile.
- Modal público mobile mantém todas as especificações visíveis e roláveis.

---

## Documento original: `README-v18.4-ADMIN.txt`

Cervejando com Diego — v18.4 ADMIN

Correções:
- Corrigido erro de JavaScript que impedia o painel editável de abrir após login válido.
- Mantida proteção por sessão Supabase válida + conta administrativa autorizada.
- Adicionado botão para mostrar/ocultar a senha digitada.
- Mantidos os ajustes mobile e de especificações da v18.3.

---

## Documento original: `README-v19-PEDIDOS-PAGAMENTO.txt`

CERVEJANDO COM DIEGO — v19 PEDIDOS + PAGAMENTO

O que entrou:
- checkout próprio no site;
- pedido gravado no Supabase antes do pagamento;
- área de pedidos preparada no Admin;
- estrutura de estoque por quantidade;
- pagamento seguro via Stripe Checkout;
- webhook para confirmar pagamento e baixar estoque;
- página /pedido-confirmado;
- WhatsApp mantido como alternativa.

ATIVAÇÃO (obrigatória para vender):
1. No Supabase > SQL Editor, execute supabase-v19-pedidos.sql.
2. Preencha stock_quantity das cervejas no Supabase.
3. Na Vercel > Project > Settings > Environment Variables, crie:
   SUPABASE_URL=https://cqtdrpwnjnetbcnuqtyv.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE_ROLE (NUNCA colocar no front)
   STRIPE_SECRET_KEY=SUA_CHAVE_SECRETA_STRIPE
   STRIPE_WEBHOOK_SECRET=SEGREDO_DO_WEBHOOK
   STRIPE_PAYMENT_METHODS=card
   Para habilitar Pix quando disponível/habilitado na conta: STRIPE_PAYMENT_METHODS=card,pix
4. No Stripe, cadastre um webhook apontando para:
   https://SEU-DOMINIO/api/stripe-webhook
   Eventos necessários:
   - checkout.session.completed
   - checkout.session.async_payment_succeeded
   - checkout.session.async_payment_failed
5. Faça novo deploy na Vercel.

IMPORTANTE:
- O valor é recalculado no servidor a partir do banco. O navegador não decide o preço.
- O navegador não marca pedido como pago. Apenas o webhook assinado faz isso.
- A SERVICE ROLE fica somente nas Environment Variables da Vercel.
- O checkout continua funcionando como catálogo/WhatsApp mesmo antes de configurar Stripe; o botão de pagamento exibirá que o servidor ainda não foi configurado.

---

## Documento original: `README-v19.1-EVENTOS.txt`

CERVEJANDO COM DIEGO — v19.1 EVENTOS

ALTERAÇÕES
- Nova aba Eventos no header desktop.
- Acesso Eventos também visível no header mobile.
- Nova seção pública de eventos alimentada pelo Supabase.
- Admin > Eventos com foto, data, local, link de compra, descrição, ordem e status ativo/inativo.
- Upload das fotos para o bucket event-images.
- Tema claro substituído por base off-white com textos escuros para preservar contraste e leitura.
- Cards e seção Eventos responsivos no mobile.

ANTES DE USAR EVENTOS
1. No Supabase > SQL Editor, execute: supabase-v19.1-eventos.sql
2. Atualize/deploye esta pasta na Vercel.
3. Entre em /admin e abra Eventos.
4. Clique em + Adicionar evento.

IMPORTANTE
O script SQL cria a tabela events, as políticas RLS e o bucket público event-images.
As credenciais públicas existentes do Supabase foram preservadas; nenhuma chave secreta foi adicionada ao navegador.

---

## Documento original: `README-v19.2-EVENTOS-DESTAQUE.txt`

CERVEJANDO COM DIEGO — v19.2

ALTERAÇÃO DESTA VERSÃO
- Cards de eventos agora exibem destaque automático conforme a proximidade da data.
- Exemplos: “É hoje”, “É amanhã”, “É neste sábado”, “Faltam 12 dias”.
- O destaque é calculado automaticamente no navegador; não exige novo campo no Supabase nem alteração no painel Admin.
- Mantida responsividade desktop/mobile e compatibilidade com tema claro/escuro.

OBSERVAÇÃO
Continue executando os scripts SQL das versões v19 e v19.1 caso ainda não tenham sido aplicados no Supabase. Esta v19.2 não exige novo SQL.

---

## Documento original: `README-v19.3-AJUSTES-VISUAIS.txt`

CERVEJANDO COM DIEGO — v19.3
Ajustes visuais e responsivos solicitados

ALTERAÇÕES
- Eventos permanece no menu principal do desktop, junto de Catálogo e demais seções.
- Removidos do bloco de ações do header: lupa de atalho, ícone de pessoa e botão/pílula extra de Eventos.
- Mobile agora usa menu hambúrguer (3 linhas), com menu completo: Início, Catálogo, Eventos, Sobre, Como funciona, Dicas do Diegão e Contato.
- Geladeira deslocada para a esquerda no desktop para equilibrar o hero.
- Título principal travado visualmente em duas linhas no desktop: “A cerveja de sempre” / “você já conhece;”.
- Fonte visual unificada em Poppins. Títulos usam negrito; textos corridos mantêm pesos regulares/médios.
- Slogan “Beba menos, beba melhor.” movido para imediatamente acima de “Explorar a seleção”.
- Busca do catálogo reduzida e posicionada acima dos filtros/tags.
- Latas centralizadas no interior dos cards.
- Informações dos cards reorganizadas para leitura rápida e consistente.
- Seção “Quem faz a curadoria” preservada lado a lado no desktop, com setas laterais para navegar entre fotos.
- Tema claro permanece off-white, com contrastes reforçados.
- Responsividade revisada para mobile.

BACKEND
- Nenhuma alteração de banco necessária para esta versão.
- Os scripts SQL da v19/v19.1 continuam válidos.
- Pedidos, pagamentos, estoque, eventos, Supabase e Admin foram preservados.

DEPLOY
1. Suba esta pasta/ZIP para a Vercel.
2. Mantenha as mesmas Environment Variables da v19.
3. Não é necessário executar novo SQL para a v19.3.

---

## Documento original: `README-v19.5-FRONT-CARDS.txt`

CERVEJANDO COM DIEGO — v19.5

Base: v19.3 estável.
Alterações realizadas somente no front solicitado e nos cards do catálogo.

FRONT
- Header desktop: Início, Catálogo, Como funciona, Eventos, Dicas do Diegão e Contato.
- Ações à direita: Carrinho, WhatsApp, Instagram e tema claro/escuro.
- Mobile: menu hambúrguer com a mesma navegação; ações permanecem compactas e responsivas.
- Hero: “A cerveja de sempre” / “você já conhece.”
- Linha divisória abaixo de “Beba menos, beba melhor.” e “Explorar a seleção” logo abaixo.
- Busca de rótulos compacta acima de filtros/cards, sem lupa decorativa grande.
- Fotos do Diegão exibidas lado a lado com setas laterais; as setas alternam a ordem das fotos.

CARDS
- Status no topo.
- Lata centralizada e dominante.
- Marca, nome e estilo em hierarquia limpa.
- Preço e volume na mesma linha.
- Mini termômetros horizontais contínuos para Intensidade e Amargor.
- Botão “Adicionar ao pedido” no rodapé.
- Layout responsivo no mobile e contraste no tema off-white.

Não houve alteração em Supabase, eventos, pedidos, pagamentos, Admin ou dados das cervejas.
Nenhum SQL novo é necessário.

---

## Documento original: `README-v19.6-AJUSTES-PONTUAIS.txt`

Cervejando com Diego v19.6 — ajustes pontuais

Base: v19.5.
Alterações exclusivas:
- alinhamento dos três benefícios do hero;
- “A cerveja de sempre” em Poppins itálico;
- margem de 2 cm na área de fotos da seção Quem faz a curadoria (desktop);
- setas laterais responsivas no desktop, tablet e mobile.

Nenhuma alteração em catálogo, cards, pedidos, pagamentos, eventos, Admin ou Supabase.
Não há SQL novo.

---

## Documento original: `README-v19.7-TIPOGRAFIA-HERO.txt`

CERVEJANDO COM DIEGO — v19.7

ALTERAÇÃO ÚNICA DESTA VERSÃO
- O trecho “A cerveja de sempre” no hero recebeu o mesmo tratamento tipográfico do destaque “do Diegão” da seção “A curadoria do Diegão”:
  • Cormorant Garamond
  • itálico
  • peso 500
  • mesma linguagem de cor editorial nos temas escuro e claro

Nenhuma outra informação, estrutura, funcionalidade, card, layout, Admin, Supabase, pedidos, pagamentos ou eventos foi alterada.
Não requer novo SQL.

---

## Documento original: `README-v20.1-STRIPE-18MAIS-VERCEL.txt`

CERVEJANDO COM DIEGO — v20.1 — STRIPE + 18+

BASE VISUAL
- Reconstruído diretamente da v19.7 limpa.
- Tamanhos, pesos, espaçamentos, hero, cards, light/dark e responsividade da v19.7 foram preservados.
- Corrigido o carregamento da Cormorant Garamond, que já era referenciada no CSS da v19.7 mas não estava no link do Google Fonts.

18+
- Aviso legal no rodapé.
- Checkbox obrigatório no checkout.
- Botão de pagamento bloqueado até a confirmação.
- API também exige ageConfirmed=true (não é apenas validação visual).
- Supabase registra age_verified e age_verified_at.

STRIPE
- Valores dos produtos são lidos no servidor via Supabase.
- Checkout Session criada pela API /api/create-checkout-session.
- Webhook existente confirma pagamento e baixa estoque.
- Taxa de entrega opcional via DELIVERY_FEE_CENTS.

VERCEL — VARIÁVEIS
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PAYMENT_METHODS=card
DELIVERY_FEE_CENTS=0

BANCO
1) Se ainda não executou, rode supabase-v19-pedidos.sql.
2) Depois rode supabase-v20-stripe-18mais.sql.

CACHE/DEPLOY
- Versão marcada como 20.1.0.
- Scripts principais usam query string ?v=20.1.0.
- HTML/JS recebem cabeçalhos no-cache/no-store na Vercel para reduzir deploy antigo preso em cache.

IMPORTANTE
- Nunca coloque STRIPE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY no HTML/JS público.
- Confirme no painel Stripe se a conta pode processar venda de bebidas alcoólicas e quais métodos de pagamento estão habilitados.

---

## Documento original: `README-v20.2-CORRECAO-VERCEL.txt`

CERVEJANDO COM DIEGO — v20.2
CORREÇÃO DE DEPLOY VERCEL + STRIPE + 18+

Base visual: v19.7.

O que foi corrigido nesta versão:
1. Tipografia restaurada exatamente ao carregamento da v19.7. Nenhuma nova fonte foi adicionada.
2. CSP do vercel.json corrigida. A regra anterior bloqueava scripts inline depois das alterações do HTML.
3. Cache busting atualizado para v20.2.0.
4. Validação 18+ permanece obrigatória no checkout e no servidor.
5. Stripe Checkout, webhook, pedidos e estoque permanecem.

IMPORTANTE PARA PUBLICAR NA VERCEL:
- Extraia o ZIP e publique A PASTA RAIZ que contém index.html, vercel.json, package.json, api/, data/, assets/ e admin/.
- Não publique a pasta pai contendo outra pasta do projeto.
- Em Project Settings > Environment Variables configure:
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  STRIPE_PAYMENT_METHODS=card
  DELIVERY_FEE_CENTS=0
- Rode supabase-v20-stripe-18mais.sql no SQL Editor do Supabase.
- Depois faça Redeploy na Vercel sem reutilizar build cache, se essa opção estiver disponível.

---

## Documento original: `README-v20.3-ADMIN-FIX.txt`

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

---

## Documento original: `README-v20.3.2-AUTH-TOKEN-FIX.txt`

CERVEJANDO COM DIEGO — v20.3.2

Correção pontual do painel Admin:
- Detecta automaticamente JWT/token expirado (incluindo "exp claim timestamp check failed").
- Renova a sessão usando refresh_token.
- Repete a operação original uma única vez após a renovação.
- Mantém login, catálogo, Stripe, 18+, Supabase e restante do projeto inalterados.

Se o navegador estiver com uma sessão antiga inválida já armazenada, saia do Admin e entre novamente uma vez após publicar esta versão.

---

## Documento original: `README-v20.4-ADMIN-CARDS-EDITAVEIS.txt`

CERVEJANDO COM DIEGO v20.4 — ADMIN / CARDS 100% EDITÁVEIS

O editor de cervejas no painel Admin permite alterar e publicar no Supabase:
- Marca
- Nome do rótulo
- Título completo
- Subtítulo
- Slug
- Estilo
- Cervejaria
- Volume
- Preço
- ABV
- IBU
- Lúpulos
- Intensidade
- Amargor
- Perfil
- Recomendação / Boa escolha para quem
- Descrição
- Quantidade e status de estoque
- Categorias
- Imagem
- Texto alternativo da imagem
- Sinal do card
- Nome usado no carrinho/pedido
- Ordem
- Produto ativo/inativo
- Produto em destaque

As alterações são salvas na tabela public.beers e refletidas no catálogo público carregado pelo Supabase.
Não foi alterado o layout público, carrinho, Stripe, autenticação ou responsividade.

---

## Documento original: `README-v20.5-GALERIA.txt`

V20.5 — GALERIA DE MÍDIA

1. Corrigida a barra dupla de rolagem do modal de adicionar/editar cerveja no Admin.
2. Cada cerveja agora aceita múltiplas imagens e vídeos.
3. A primeira mídia é tratada como capa; no Admin é possível reordenar e remover mídias.
4. Quando houver mais de uma mídia, o modal público mostra setas laterais e contador.
5. Vídeos MP4/WebM/MOV podem ser reproduzidos dentro do modal.

IMPORTANTE: antes de testar o upload múltiplo, rode o arquivo supabase-v20.5-galeria-midias.sql no SQL Editor do Supabase.

---

## Documento original: `README-v20.5.9-PERGUNTE-DIEGAO.txt`

CERVEJANDO COM DIEGO — v20.5.9 — PERGUNTE PRO DIEGÃO

ALTERAÇÕES
- Não abre mais Gmail, Outlook ou mailto.
- Envio em segundo plano por /api/send-question.
- Destino: contato@cervejandocomdiego.com.br.
- Reply-To: e-mail digitado pelo cliente.
- Estado "Enviando...", limpeza do formulário e popup de sucesso.
- Botão "Explorar o catálogo" fecha o popup e leva ao catálogo.
- Validação e honeypot anti-spam.

CONFIGURAÇÃO NA VERCEL
1. No Resend, verifique o domínio cervejandocomdiego.com.br e adicione os registros DNS solicitados.
2. Crie uma API Key no Resend.
3. Vercel > Project > Settings > Environment Variables:
   RESEND_API_KEY = re_...
   QUESTION_FROM_EMAIL = Cervejando com Diego <site@cervejandocomdiego.com.br>
   QUESTION_TO_EMAIL = contato@cervejandocomdiego.com.br
4. Marque Production (e Preview, se desejar testar previews).
5. Faça um novo Redeploy.

A senha do Zoho não deve ser colocada no código.

---

## Documento original: `README-VERCEL.txt`

CERVEJANDO COM DIEGO — v18.5 VERCEL

Esta versão foi adaptada da v18.4 ADMIN/NETLIFY para publicação estática na Vercel.

O QUE FOI ALTERADO
- Removido o arquivo _headers específico do Netlify.
- Criado vercel.json com os mesmos cabeçalhos de segurança.
- /admin continua protegido pelo login do Supabase e recebe no-store + noindex.
- Adicionado rewrite para /admin abrir admin/index.html corretamente.
- cleanUrls habilitado.
- Catálogo público, carrinho, WhatsApp, tema claro/escuro e painel Admin foram preservados.
- Integração atual com Supabase foi preservada sem troca de projeto/banco.

COMO PUBLICAR NA VERCEL
1. Crie um novo projeto na Vercel.
2. Envie esta pasta para um repositório GitHub ou use a importação do projeto.
3. Framework Preset: Other.
4. Build Command: deixe vazio.
5. Output Directory: deixe vazio (raiz do projeto).
6. Deploy.

IMPORTANTE — URL FINAL
O index.html ainda contém a URL pública atual do Netlify nas tags canonical/Open Graph/Twitter. Isso foi mantido para não inventar um domínio Vercel que ainda não existe.
Depois que a Vercel fornecer o domínio definitivo (ou após conectar seu domínio próprio), substitua no <head>:
- canonical
- og:url
- og:image
- og:image:secure_url
- twitter:image

SUPABASE
O site usa atualmente:
https://cqtdrpwnjnetbcnuqtyv.supabase.co

A publishable key existente foi preservada. Ela é destinada ao navegador; a segurança real do banco deve continuar sendo feita por RLS/policies no Supabase.

No Supabase Auth, depois de definir o domínio final, revise:
Authentication > URL Configuration
- Site URL: domínio final da Vercel
- Redirect URLs: adicione o domínio final e, se necessário, /admin

TESTE APÓS DEPLOY
- Home e imagens
- Busca e filtros
- Modal das cervejas
- Carrinho
- Finalização pelo WhatsApp
- /admin
- Login do administrador
- Mostrar/ocultar senha
- Adicionar/editar/ocultar cerveja
- Upload de imagem
- Atualização do catálogo público após alteração no Admin
- Mobile e modo claro/escuro

---

## Documento original: `README.txt`

CERVEJANDO COM DIEGO — Landing Page final

- 10 cervejas na sequência enviada.
- Imagens das latas recortadas com fundo transparente real (alpha).
- Geladeira slim com apenas 6 latas, mais próximas.
- Filtros clicáveis abrem/mostram cervejas por característica.
- Modal responsivo com rolagem própria para leitura das especificações.
- Chuva de lúpulos com 50% de transparência nos detalhes.
- Seção Sobre com Diegão sem fundo.
- Ícone branco no topo e favicon branco.

Abra index.html no navegador. Para publicar, envie index.html + pasta assets mantendo a estrutura.
