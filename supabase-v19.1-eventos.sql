-- CERVEJANDO COM DIEGO v19.1 — EVENTOS
-- Execute no SQL Editor do Supabase depois do script da v19.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  location text not null,
  purchase_url text,
  description text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Public read active events" on public.events;
create policy "Public read active events" on public.events
for select to anon, authenticated
using (active = true or public.is_admin(auth.uid()));

drop policy if exists "Admins insert events" on public.events;
create policy "Admins insert events" on public.events
for insert to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins update events" on public.events;
create policy "Admins update events" on public.events
for update to authenticated
using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "Admins delete events" on public.events;
create policy "Admins delete events" on public.events
for delete to authenticated using (public.is_admin(auth.uid()));

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('event-images','event-images',true,5242880,array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/png','image/jpeg','image/webp'];

drop policy if exists "Public read event images" on storage.objects;
create policy "Public read event images" on storage.objects
for select to public using (bucket_id='event-images');

drop policy if exists "Admins upload event images" on storage.objects;
create policy "Admins upload event images" on storage.objects
for insert to authenticated with check (bucket_id='event-images' and public.is_admin(auth.uid()));

drop policy if exists "Admins update event images" on storage.objects;
create policy "Admins update event images" on storage.objects
for update to authenticated using (bucket_id='event-images' and public.is_admin(auth.uid())) with check (bucket_id='event-images' and public.is_admin(auth.uid()));

drop policy if exists "Admins delete event images" on storage.objects;
create policy "Admins delete event images" on storage.objects
for delete to authenticated using (bucket_id='event-images' and public.is_admin(auth.uid()));

create index if not exists events_date_idx on public.events(event_date,sort_order);
