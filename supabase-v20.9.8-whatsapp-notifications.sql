-- CERVEJANDO COM DIEGO — aviso de pedido pago por WhatsApp
-- Execute no SQL Editor do Supabase antes de publicar a integração.

create table if not exists public.order_whatsapp_notifications (
  order_id uuid primary key references public.orders(id) on delete cascade,
  status text not null default 'sending' check (status in ('sending','sent','failed')),
  attempts integer not null default 1 check (attempts > 0),
  provider_message_id text,
  last_error text,
  lease_expires_at timestamptz not null default (now() + interval '5 minutes'),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.order_whatsapp_notifications enable row level security;

create or replace function public.claim_order_whatsapp_notification(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare v_claimed boolean := false;
begin
  insert into public.order_whatsapp_notifications(order_id, status, attempts, lease_expires_at)
  values (p_order_id, 'sending', 1, now() + interval '5 minutes')
  on conflict (order_id) do nothing;

  if found then
    return true;
  end if;

  update public.order_whatsapp_notifications
  set status = 'sending',
      attempts = attempts + 1,
      last_error = null,
      lease_expires_at = now() + interval '5 minutes',
      updated_at = now()
  where order_id = p_order_id
    and (status = 'failed' or (status = 'sending' and lease_expires_at < now()))
  returning true into v_claimed;

  return coalesce(v_claimed, false);
end;
$$;

create or replace function public.finish_order_whatsapp_notification(
  p_order_id uuid,
  p_status text,
  p_provider_message_id text default null,
  p_error text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_status not in ('sent','failed') then
    raise exception 'Invalid WhatsApp notification status';
  end if;

  update public.order_whatsapp_notifications
  set status = p_status,
      provider_message_id = p_provider_message_id,
      last_error = left(p_error, 1000),
      sent_at = case when p_status = 'sent' then now() else null end,
      lease_expires_at = now(),
      updated_at = now()
  where order_id = p_order_id;

  if not found then
    raise exception 'WhatsApp notification claim not found';
  end if;
end;
$$;

revoke all on function public.claim_order_whatsapp_notification(uuid) from public, anon, authenticated;
revoke all on function public.finish_order_whatsapp_notification(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.claim_order_whatsapp_notification(uuid) to service_role;
grant execute on function public.finish_order_whatsapp_notification(uuid,text,text,text) to service_role;
