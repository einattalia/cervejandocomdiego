-- Executar APÓS supabase-parceiros-consignacao.sql.
-- Contratos privados, acessíveis apenas a administradores.
alter table public.consignment_partners add column if not exists contract_path text;
alter table public.consignment_partners add column if not exists contract_name text;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('consignment-contracts','consignment-contracts',false,10485760,array['application/pdf','image/png','image/jpeg','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists consignment_contracts_select on storage.objects;
create policy consignment_contracts_select on storage.objects for select to authenticated using(bucket_id='consignment-contracts' and public.is_admin((select auth.uid())));
drop policy if exists consignment_contracts_insert on storage.objects;
create policy consignment_contracts_insert on storage.objects for insert to authenticated with check(bucket_id='consignment-contracts' and public.is_admin((select auth.uid())));
create table if not exists public.consignment_visits (
 id uuid primary key default gen_random_uuid(), partner_id uuid not null references public.consignment_partners(id),
 visited_on date not null, notes text, units_sold integer not null default 0,
 gross_sales numeric(12,2) not null default 0, due_amount numeric(12,2) not null default 0,
 received_amount numeric(12,2) not null default 0, created_by uuid default auth.uid(),
 created_at timestamptz not null default now()
);
create index if not exists consignment_visits_partner_date on public.consignment_visits(partner_id,visited_on desc);
alter table public.consignment_visits enable row level security;
revoke all on public.consignment_visits from anon;
grant select on public.consignment_visits to authenticated;
drop policy if exists consignment_visits_admin_select on public.consignment_visits;
create policy consignment_visits_admin_select on public.consignment_visits for select to authenticated using(public.is_admin((select auth.uid())));
-- A conferência, baixas de estoque, repasse e visita são gravados na MESMA transação.
create or replace function public.consignment_register_visit(
 p_partner_id uuid,p_visited_on date,p_notes text,p_received numeric,p_items jsonb
) returns uuid language plpgsql security invoker set search_path='' as $$
declare v_partner public.consignment_partners%rowtype; v_item jsonb; v_beer uuid;
 v_expected int;v_remaining int;v_actual int;v_sold int;v_total int:=0;
 v_gross numeric:=0;v_due numeric:=0;v_price numeric;v_cost numeric;v_id uuid;
 v_pending numeric;
begin
 if not public.is_admin(auth.uid()) then raise exception 'Sem permissão';end if;
 if p_visited_on is null or p_visited_on>current_date then raise exception 'Data da visita inválida';end if;
 if jsonb_typeof(p_items)!='array' or jsonb_array_length(p_items)=0 then raise exception 'Informe os rótulos conferidos';end if;
 select * into v_partner from public.consignment_partners where id=p_partner_id for update;
 if not found then raise exception 'Parceiro não encontrado';end if;
 if p_received is null or p_received<0 then raise exception 'Recebimento inválido';end if;
 if (select count(*) from jsonb_array_elements(p_items))<>(select count(distinct x->>'beer_id') from jsonb_array_elements(p_items) x) then raise exception 'Rótulo duplicado';end if;
 for v_item in select * from jsonb_array_elements(p_items) loop
   v_beer:=(v_item->>'beer_id')::uuid;v_expected:=(v_item->>'expected')::int;v_remaining:=(v_item->>'remaining')::int;
   v_price:=(v_item->>'price')::numeric;v_cost:=(v_item->>'cost')::numeric;
   if v_expected<0 or v_remaining<0 or v_remaining>v_expected or v_price<0 or v_cost<0 then raise exception 'Quantidade ou preço inválido';end if;
   select coalesce(sum(case when movement_type='delivery' then quantity when movement_type='adjustment' then quantity else -quantity end),0) into v_actual from public.consignment_movements where partner_id=p_partner_id and beer_id=v_beer;
   if v_actual<>v_expected then raise exception 'Estoque alterado durante a conferência. Atualize a página.';end if;
   v_sold:=v_expected-v_remaining;v_total:=v_total+v_sold;v_gross:=v_gross+v_sold*v_price;
   if v_sold>0 then insert into public.consignment_movements(partner_id,beer_id,movement_type,quantity,unit_cost,unit_price,partner_share,notes)
     values(p_partner_id,v_beer,'sale',v_sold,v_cost,v_price,v_partner.partner_share,'Visita '||p_visited_on::text||': '||coalesce(p_notes,''));end if;
 end loop;
 v_due:=round(v_gross*(1-v_partner.partner_share/100),2);
 select coalesce(sum(quantity*unit_price*(1-partner_share/100)) filter(where movement_type='sale'),0)-
 (select coalesce(sum(amount),0) from public.consignment_settlements where partner_id=p_partner_id)
 into v_pending from public.consignment_movements where partner_id=p_partner_id;
 if p_received>v_pending+0.001 then raise exception 'Recebimento acima do valor pendente';end if;
 if p_received>0 then insert into public.consignment_settlements(partner_id,amount,notes) values(p_partner_id,p_received,'Recebido na visita '||p_visited_on::text);end if;
 insert into public.consignment_visits(partner_id,visited_on,notes,units_sold,gross_sales,due_amount,received_amount)
 values(p_partner_id,p_visited_on,p_notes,v_total,v_gross,v_due,p_received) returning id into v_id;
 return v_id;
end $$;
revoke all on function public.consignment_register_visit(uuid,date,text,numeric,jsonb) from public,anon;
grant execute on function public.consignment_register_visit(uuid,date,text,numeric,jsonb) to authenticated;
grant insert on public.consignment_visits to authenticated;
drop policy if exists consignment_visits_admin_insert on public.consignment_visits;
create policy consignment_visits_admin_insert on public.consignment_visits for insert to authenticated with check(public.is_admin((select auth.uid())));
