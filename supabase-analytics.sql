-- Analytics próprios do Cervejando com Diego.
-- Execute depois de supabase-v20.9.20-controle-vendas.sql,
-- supabase-v20.9.22-liquido-stripe.sql e supabase-v21-kits.sql.

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_id uuid not null unique,
  event_name text not null check (event_name in ('page_view','product_view','add_to_cart','begin_checkout','purchase')),
  visitor_id uuid not null,
  session_id uuid not null,
  page_path text not null default '/',
  traffic_source text not null default '(direto)',
  traffic_medium text not null default '(nenhum)',
  traffic_campaign text,
  product_slug text,
  product_name text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_name_created_idx on public.analytics_events(event_name, created_at desc);
create index if not exists analytics_events_session_idx on public.analytics_events(session_id, created_at desc);
create index if not exists analytics_events_product_idx on public.analytics_events(product_slug, created_at desc) where product_slug is not null;

alter table public.orders add column if not exists analytics_visitor_id uuid;
alter table public.orders add column if not exists analytics_session_id uuid;
alter table public.orders add column if not exists ga_client_id text;
alter table public.orders add column if not exists ga_session_id text;

alter table public.analytics_events enable row level security;
revoke all on table public.analytics_events from public, anon, authenticated;
grant select on table public.analytics_events to authenticated;
grant insert on table public.analytics_events to service_role;
grant usage, select on sequence public.analytics_events_id_seq to service_role;

drop policy if exists "Admins read analytics events" on public.analytics_events;
create policy "Admins read analytics events" on public.analytics_events
  for select to authenticated using (public.is_admin((select auth.uid())));

create or replace function public.get_admin_analytics(p_start timestamptz, p_end timestamptz)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with window_events as (
    select * from public.analytics_events
    where created_at >= p_start and created_at < p_end
  ),
  paid_orders as (
    select id, total, coalesce(amount_refunded,0) as amount_refunded, paid_at, payment_provider, stripe_livemode
    from public.orders
    where payment_status in ('paid','partially_refunded')
      and payment_provider = 'stripe'
      and coalesce(stripe_livemode,true)
      and coalesce(amount_refunded,0) < total
      and paid_at >= p_start and paid_at < p_end
  ),
  sessions as (
    select session_id,
      bool_or(event_name = 'add_to_cart') as has_cart,
      bool_or(event_name = 'purchase') as has_purchase,
      max(created_at) as last_activity
    from window_events group by session_id
  ),
  days as (
    select generate_series(
      date_trunc('day', p_start at time zone 'America/Sao_Paulo'),
      date_trunc('day', (p_end - interval '1 millisecond') at time zone 'America/Sao_Paulo'),
      interval '1 day'
    ) as day_local
  ),
  visit_days as (
    select date_trunc('day', created_at at time zone 'America/Sao_Paulo') as day_local, count(*) as visits
    from window_events where event_name='page_view'
    group by 1
  ),
  sales_days as (
    select date_trunc('day', paid_at at time zone 'America/Sao_Paulo') as day_local, sum(total - amount_refunded) as sales
    from paid_orders group by 1
  )
  select jsonb_build_object(
    'visits', (select count(*) from window_events where event_name = 'page_view'),
    'unique_visitors', (select count(distinct visitor_id) from window_events where event_name = 'page_view'),
    'abandoned_carts', (select count(*) from sessions s where has_cart and not has_purchase and last_activity < now() - interval '30 minutes' and not exists (select 1 from public.orders o where o.analytics_session_id=s.session_id and o.payment_provider='stripe' and o.payment_status in ('paid','partially_refunded','refunded'))),
    'paid_orders', (select count(*) from paid_orders),
    'conversion_rate', coalesce((select count(*)::numeric * 100 / nullif((select count(distinct visitor_id) from window_events where event_name = 'page_view'), 0) from paid_orders), 0),
    'sales', coalesce((select sum(total - amount_refunded) from paid_orders), 0),
    'traffic_sources', coalesce((
      select jsonb_agg(jsonb_build_object('source',source,'visits',visits) order by visits desc)
      from (select traffic_source as source, count(*) as visits from window_events where event_name='page_view' group by traffic_source order by count(*) desc limit 8) ranked
    ), '[]'::jsonb),
    'top_products', coalesce((
      select jsonb_agg(jsonb_build_object('slug',slug,'name',name,'views',views) order by views desc)
      from (select product_slug as slug, coalesce(max(product_name),product_slug) as name, count(*) as views from window_events where event_name='product_view' and product_slug is not null group by product_slug order by count(*) desc limit 8) ranked
    ), '[]'::jsonb),
    'series', coalesce((
      select jsonb_agg(jsonb_build_object('date',days.day_local::date,'visits',coalesce(visit_days.visits,0),'sales',coalesce(sales_days.sales,0)) order by days.day_local)
      from days left join visit_days using(day_local) left join sales_days using(day_local)
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_admin_analytics(timestamptz,timestamptz) from public, anon;
grant execute on function public.get_admin_analytics(timestamptz,timestamptz) to authenticated;
