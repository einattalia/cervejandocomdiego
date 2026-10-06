-- Informativos editáveis da seção Monte seu evento
create table if not exists public.party_event_content (
  id uuid primary key default '00000000-0000-4000-8000-000000000001'::uuid,
  included_items jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint party_event_content_singleton check (id='00000000-0000-4000-8000-000000000001'::uuid),
  constraint party_event_content_max_images check (jsonb_typeof(images)='array' and jsonb_array_length(images)<=20),
  constraint party_event_content_items_array check (jsonb_typeof(included_items)='array' and jsonb_array_length(included_items)<=30)
);
alter table public.party_event_content enable row level security;
grant select on public.party_event_content to anon, authenticated;
grant insert, update on public.party_event_content to authenticated;
drop policy if exists "Public read party event content" on public.party_event_content;
create policy "Public read party event content" on public.party_event_content for select to anon, authenticated using (true);
drop policy if exists "Admins insert party event content" on public.party_event_content;
create policy "Admins insert party event content" on public.party_event_content for insert to authenticated with check (public.is_admin(auth.uid()));
drop policy if exists "Admins update party event content" on public.party_event_content;
create policy "Admins update party event content" on public.party_event_content for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
