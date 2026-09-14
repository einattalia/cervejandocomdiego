-- CERVEJANDO COM DIEGO v20.5.3 — EVENTOS: PERÍODO + INSTAGRAM
alter table public.events add column if not exists event_end_date date;
alter table public.events add column if not exists instagram_handle text;
alter table public.events drop constraint if exists events_end_date_not_before_start;
alter table public.events add constraint events_end_date_not_before_start check (event_end_date is null or event_end_date >= event_date);
