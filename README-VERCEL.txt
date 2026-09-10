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
