-- CERVEJANDO COM DIEGO v20.1 — STRIPE + VALIDAÇÃO 18+
-- Execute no SQL Editor do Supabase APÓS o supabase-v19-pedidos.sql.

alter table public.orders add column if not exists age_verified boolean not null default false;
alter table public.orders add column if not exists age_verified_at timestamptz;

comment on column public.orders.age_verified is 'Declaração de maioridade informada no checkout';
comment on column public.orders.age_verified_at is 'Data/hora em que a declaração 18+ foi registrada';
