# Monte seu evento — versão 20.9.4

## O que mudou
- Nova sessão no admin para editar os informativos de Monte seu evento.
- Lista de até 30 itens que podem estar inclusos na estrutura.
- Galeria de até 20 fotos, com recomendação de pelo menos 10; JPG, PNG e WEBP, até 5 MB por arquivo.
- Legenda opcional por imagem; adição e remoção de fotos.
- Galeria e itens aparecem na página pública após salvar.
- Fotos usam o bucket público `event-images` já criado pela configuração anterior da Agenda Cervejeira.

## Configuração necessária
Execute uma vez o arquivo `supabase-monte-seu-evento.sql` no SQL Editor do projeto Supabase usado pelo site. O projeto Cervejando não apareceu entre os projetos disponíveis nesta sessão, então a migração segue incluída para aplicação pelo responsável. Ela cria uma linha única e aplica RLS: leitura pública e gravação somente por administradores reconhecidos por `public.is_admin(auth.uid())`.

Depois, publique os arquivos do ZIP junto com o SQL aplicado.
