-- Cervejando com Diego v21 — kits, componentes e estoque
-- Execute uma vez no SQL Editor do Supabase antes de publicar o código.

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('glassware','gift','packaging','other')),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  unit_cost numeric(10,2) not null default 0 check (unit_cost >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kits (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  image_url text,
  price numeric(10,2) not null check (price >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kit_components (
  id uuid primary key default gen_random_uuid(),
  kit_id uuid not null references public.kits(id) on delete cascade,
  component_type text not null check (component_type in ('beer','inventory')),
  beer_id uuid references public.beers(id) on delete restrict,
  inventory_item_id uuid references public.inventory_items(id) on delete restrict,
  component_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_cost numeric(10,2) not null default 0 check (unit_cost >= 0),
  sort_order integer not null default 0,
  check ((component_type = 'beer' and beer_id is not null and inventory_item_id is null)
      or (component_type = 'inventory' and inventory_item_id is not null and beer_id is null))
);

alter table public.order_items add column if not exists item_type text not null default 'beer';
alter table public.order_items add column if not exists kit_id uuid references public.kits(id) on delete set null;
alter table public.order_items add column if not exists components_snapshot jsonb not null default '[]'::jsonb;
alter table public.stock_movements add column if not exists inventory_item_id uuid references public.inventory_items(id) on delete set null;

alter table public.inventory_items enable row level security;
alter table public.kits enable row level security;
alter table public.kit_components enable row level security;

drop policy if exists "Admins manage inventory items" on public.inventory_items;
create policy "Admins manage inventory items" on public.inventory_items for all to authenticated
  using (public.is_admin((select auth.uid()))) with check (public.is_admin((select auth.uid())));
drop policy if exists "Admins manage kits" on public.kits;
create policy "Admins manage kits" on public.kits for all to authenticated
  using (public.is_admin((select auth.uid()))) with check (public.is_admin((select auth.uid())));
drop policy if exists "Admins manage kit components" on public.kit_components;
create policy "Admins manage kit components" on public.kit_components for all to authenticated
  using (public.is_admin((select auth.uid()))) with check (public.is_admin((select auth.uid())));

grant select, insert, update, delete on public.inventory_items, public.kits, public.kit_components to authenticated;
grant all on public.inventory_items, public.kits, public.kit_components to service_role;
grant all on public.order_items, public.stock_movements to service_role;
grant select on public.kits to anon;

-- Retorna somente dados públicos do produto; custos e identificadores de estoque ficam privados.
create or replace function public.get_active_kits()
returns setof jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'id', k.id, 'slug', k.slug, 'name', k.name, 'description', k.description,
    'image_url', k.image_url, 'price', k.price, 'sort_order', k.sort_order,
    'active', k.active,
    'available_quantity', case when not exists(select 1 from public.kit_components c0 where c0.kit_id=k.id) then 0 else (
      select min(floor(s.available::numeric / c.required_quantity)::integer)
      from (
        select component_type,beer_id,inventory_item_id,sum(quantity) as required_quantity
        from public.kit_components where kit_id=k.id
        group by component_type,beer_id,inventory_item_id
      ) c
      cross join lateral (
        select case
          when c.component_type = 'beer' then (select case when b.active then b.stock_quantity else 0 end from public.beers b where b.id = c.beer_id)
          else (select case when i.active then i.stock_quantity else 0 end from public.inventory_items i where i.id = c.inventory_item_id)
        end as available
      ) s
      where s.available is not null
    ) end
  )
  from public.kits k where k.active = true order by k.sort_order, k.name;
$$;
revoke all on function public.get_active_kits() from public;
grant execute on function public.get_active_kits() to anon, authenticated;

create or replace function public.mark_order_paid(p_order_id uuid,p_payment_provider text,p_payment_reference text)
returns void language plpgsql security definer set search_path = '' as $$
declare item record; component jsonb; current_status text; beer_uuid uuid; inventory_uuid uuid; component_qty integer;
begin
  select payment_status into current_status from public.orders where id=p_order_id for update;
  if current_status is null then raise exception 'Pedido não encontrado'; end if;
  if current_status='paid' then return; end if;

  for item in select oi.beer_id,oi.quantity,oi.item_type,oi.components_snapshot from public.order_items oi where oi.order_id=p_order_id loop
    if item.item_type = 'kit' then
      for component in select value from jsonb_array_elements(item.components_snapshot) loop
        beer_uuid := nullif(component->>'beer_id','')::uuid;
        inventory_uuid := nullif(component->>'inventory_item_id','')::uuid;
        component_qty := (component->>'quantity')::integer * item.quantity;
        if beer_uuid is not null then
          update public.beers set stock_quantity=case when stock_quantity is null then null else greatest(stock_quantity-component_qty,0) end,
            stock_status=case when stock_quantity is null then stock_status when greatest(stock_quantity-component_qty,0)=0 then 'sold_out' when greatest(stock_quantity-component_qty,0)<=3 then 'low_stock' else 'in_stock' end where id=beer_uuid;
          insert into public.stock_movements(beer_id,order_id,movement_type,quantity,note) values(beer_uuid,p_order_id,'sale',-component_qty,'Baixa automática de kit após pagamento');
        elsif inventory_uuid is not null then
          update public.inventory_items set stock_quantity=greatest(stock_quantity-component_qty,0),updated_at=now() where id=inventory_uuid;
          insert into public.stock_movements(inventory_item_id,order_id,movement_type,quantity,note) values(inventory_uuid,p_order_id,'sale',-component_qty,'Baixa automática de kit após pagamento');
        end if;
      end loop;
    elsif item.beer_id is not null then
      update public.beers set stock_quantity=case when stock_quantity is null then null else greatest(stock_quantity-item.quantity,0) end,
        stock_status=case when stock_quantity is null then stock_status when greatest(stock_quantity-item.quantity,0)=0 then 'sold_out' when greatest(stock_quantity-item.quantity,0)<=3 then 'low_stock' else 'in_stock' end where id=item.beer_id;
      insert into public.stock_movements(beer_id,order_id,movement_type,quantity,note) values(item.beer_id,p_order_id,'sale',-item.quantity,'Baixa automática após pagamento');
    end if;
  end loop;
  update public.orders set payment_status='paid',status='paid',payment_provider=p_payment_provider,payment_reference=p_payment_reference,paid_at=now(),updated_at=now() where id=p_order_id;
end;
$$;
revoke all on function public.mark_order_paid(uuid,text,text) from public,anon,authenticated;
grant execute on function public.mark_order_paid(uuid,text,text) to service_role;

create index if not exists kit_components_kit_id_idx on public.kit_components(kit_id);
create index if not exists kit_components_beer_id_idx on public.kit_components(beer_id);
create index if not exists kit_components_inventory_item_id_idx on public.kit_components(inventory_item_id);
create index if not exists order_items_kit_id_idx on public.order_items(kit_id);
