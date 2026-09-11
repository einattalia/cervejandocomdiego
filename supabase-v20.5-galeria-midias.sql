-- Cervejando com Diego v20.5 — galeria de imagens e vídeos
alter table public.beers add column if not exists media_urls jsonb not null default '[]'::jsonb;

-- Mantém a imagem atual como primeira mídia quando ainda não houver galeria.
update public.beers
set media_urls = jsonb_build_array(jsonb_build_object('url', image_url, 'type', 'image'))
where image_url is not null and image_url <> '' and (media_urls is null or media_urls = '[]'::jsonb);

-- Libera o bucket existente para imagens e vídeos.
update storage.buckets
set public = true,
    file_size_limit = 41943040,
    allowed_mime_types = array['image/png','image/jpeg','image/webp','video/mp4','video/webm','video/quicktime']
where id = 'beer-images';
