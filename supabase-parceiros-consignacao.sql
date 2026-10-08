-- Execute no SQL Editor do projeto Supabase antes de usar Parceiros & Consignação.
create table if not exists public.consignment_partners (
 id uuid primary key default gen_random_uuid(), name text not null, cnpj text,
 sales_contact text not null, phone text, address text, fridge_code text,
 partner_share numeric(5,2) not null default 50 check(partner_share between 0 and 100),
 status text not null default 'active' check(status in ('active','watch','inactive')),
 created_at timestamptz not null default now()
);
create unique index if not exists consignment_partners_cnpj_unique on public.consignment_partners(cnpj) where cnpj is not null;
create table if not exists public.consignment_movements (
 id uuid primary key default gen_random_uuid(), partner_id uuid not null references public.consignment_partners(id),
 beer_id uuid not null references public.beers(id),
 movement_type text not null check(movement_type in ('delivery','sale','return','loss','adjustment')),
 quantity integer not null check(quantity <> 0),
 unit_cost numeric(12,2) not null check(unit_cost >= 0),
 unit_price numeric(12,2) not null check(unit_price >= 0),
 partner_share numeric(5,2) not null check(partner_share between 0 and 100),
 notes text, created_at timestamptz not null default now(), created_by uuid default auth.uid(),
 constraint consignment_movement_sign check ((movement_type='adjustment') or quantity>0)
);
create table if not exists public.consignment_settlements (
 id uuid primary key default gen_random_uuid(), partner_id uuid not null references public.consignment_partners(id),
 amount numeric(12,2) not null check(amount>0), notes text,
 paid_at timestamptz not null default now(), created_by uuid default auth.uid()
);
create index if not exists consignment_movements_partner_idx on public.consignment_movements(partner_id,created_at);
create index if not exists consignment_settlements_partner_idx on public.consignment_settlements(partner_id,paid_at);
-- As movimentações são imutáveis: erros devem ser corrigidos por novo lançamento.
create or replace function public.consignment_validate_stock() returns trigger language plpgsql set search_path = '' as $$
declare available_qty integer;
begin
 perform 1 from public.consignment_partners where id=new.partner_id for update;
 select coalesce(sum(case when movement_type='delivery' then quantity when movement_type='adjustment' then quantity else -quantity end),0)
 into available_qty from public.consignment_movements where partner_id=new.partner_id and beer_id=new.beer_id;
 if (case when new.movement_type='delivery' then new.quantity when new.movement_type='adjustment' then new.quantity else -new.quantity end)+available_qty < 0 then
 raise exception 'Estoque insuficiente para esta movimentação'; end if;
 return new;
end $$;
drop trigger if exists consignment_validate_stock_trigger on public.consignment_movements;
create trigger consignment_validate_stock_trigger before insert on public.consignment_movements for each row execute function public.consignment_validate_stock();
-- O servidor determina a comissão da venda conforme o cadastro do parceiro.
create or replace function public.consignment_set_share() returns trigger language plpgsql set search_path = '' as $$
begin
 select partner_share into new.partner_share from public.consignment_partners where id=new.partner_id;
 return new;
end $$;
drop trigger if exists consignment_set_share_trigger on public.consignment_movements;
create trigger consignment_set_share_trigger before insert on public.consignment_movements for each row execute function public.consignment_set_share();
create or replace function public.consignment_immutable() returns trigger language plpgsql set search_path = '' as $$
begin raise exception 'Registro financeiro imutável; faça um lançamento de correção'; end $$;
drop trigger if exists consignment_movements_immutable on public.consignment_movements;
create trigger consignment_movements_immutable before update or delete on public.consignment_movements for each row execute function public.consignment_immutable();
drop trigger if exists consignment_settlements_immutable on public.consignment_settlements;
create trigger consignment_settlements_immutable before update or delete on public.consignment_settlements for each row execute function public.consignment_immutable();
alter table public.consignment_partners enable row level security;
alter table public.consignment_movements enable row level security;
alter table public.consignment_settlements enable row level security;
revoke all on public.consignment_partners, public.consignment_movements, public.consignment_settlements from anon;
grant select,insert,update on public.consignment_partners to authenticated;
grant select,insert on public.consignment_movements,public.consignment_settlements to authenticated;
drop policy if exists partners_admin_select on public.consignment_partners;
create policy partners_admin_select on public.consignment_partners for select to authenticated using (public.is_admin((select auth.uid())));
drop policy if exists partners_admin_insert on public.consignment_partners;
create policy partners_admin_insert on public.consignment_partners for insert to authenticated with check (public.is_admin((select auth.uid())));
drop policy if exists partners_admin_update on public.consignment_partners;
create policy partners_admin_update on public.consignment_partners for update to authenticated using (public.is_admin((select auth.uid()))) with check (public.is_admin((select auth.uid())));
drop policy if exists movements_admin_select on public.consignment_movements;
create policy movements_admin_select on public.consignment_movements for select to authenticated using (public.is_admin((select auth.uid())));
drop policy if exists movements_admin_insert on public.consignment_movements;
create policy movements_admin_insert on public.consignment_movements for insert to authenticated with check (public.is_admin((select auth.uid())));
drop policy if exists settlements_admin_select on public.consignment_settlements;
create policy settlements_admin_select on public.consignment_settlements for select to authenticated using (public.is_admin((select auth.uid())));
drop policy if exists settlements_admin_insert on public.consignment_settlements;
create policy settlements_admin_insert on public.consignment_settlements for insert to authenticated with check (public.is_admin((select auth.uid())));

