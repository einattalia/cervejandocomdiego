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
