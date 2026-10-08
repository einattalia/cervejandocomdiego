-- CERVEJANDO COM DIEGO v20.9.20 — CONCILIAÇÃO DE VENDAS
-- Execute no SQL Editor do Supabase antes de publicar esta versão.

alter table public.orders
  add column if not exists amount_refunded numeric(10,2) not null default 0,
  add column if not exists refunded_at timestamptz,
  add column if not exists stripe_reconciled_at timestamptz,
  add column if not exists stripe_reconciliation_error text;

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('pending','paid','partially_refunded','refunded','failed','expired'));

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  order_id uuid references public.orders(id) on delete set null,
  processing_status text not null default 'processing'
    check (processing_status in ('processing','processed','failed','ignored')),
  error_message text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists stripe_webhook_events_status_received_idx
  on public.stripe_webhook_events(processing_status, received_at desc);
create index if not exists stripe_webhook_events_order_idx
  on public.stripe_webhook_events(order_id, received_at desc);

alter table public.stripe_webhook_events enable row level security;
revoke all on public.stripe_webhook_events from public, anon, authenticated;
grant select on public.stripe_webhook_events to authenticated;
grant all on public.stripe_webhook_events to service_role;
drop policy if exists "Admins read Stripe webhook events" on public.stripe_webhook_events;
create policy "Admins read Stripe webhook events"
  on public.stripe_webhook_events for select to authenticated
  using (public.is_admin(auth.uid()));

-- Mantém a baixa de estoque idempotente também após estornos.
create or replace function public.mark_order_paid(p_order_id uuid,p_payment_provider text,p_payment_reference text)
returns void language plpgsql security definer set search_path = '' as $$
declare item record; current_status text;
begin
  select payment_status into current_status from public.orders where id=p_order_id for update;
  if current_status is null then raise exception 'Pedido não encontrado'; end if;
  if current_status in ('paid','partially_refunded','refunded') then return; end if;
  for item in select oi.beer_id,oi.quantity from public.order_items oi where oi.order_id=p_order_id loop
    if item.beer_id is not null then
      update public.beers
      set stock_quantity=case when stock_quantity is null then null else greatest(stock_quantity-item.quantity,0) end,
          stock_status=case when stock_quantity is null then stock_status when greatest(stock_quantity-item.quantity,0)=0 then 'sold_out' when greatest(stock_quantity-item.quantity,0)<=3 then 'low_stock' else 'in_stock' end
      where id=item.beer_id;
      insert into public.stock_movements(beer_id,order_id,movement_type,quantity,note)
      values(item.beer_id,p_order_id,'sale',-item.quantity,'Baixa automática após pagamento');
    end if;
  end loop;
  update public.orders set payment_status='paid',status='paid',payment_provider=p_payment_provider,
    payment_reference=p_payment_reference,paid_at=now(),updated_at=now() where id=p_order_id;
end;
$$;

-- A função de confirmação é chamada somente pelo webhook com service_role.
revoke all on function public.mark_order_paid(uuid,text,text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(uuid,text,text) to service_role;

