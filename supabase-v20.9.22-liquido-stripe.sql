-- CERVEJANDO COM DIEGO v20.9.22 — TAXAS REAIS E AMBIENTE STRIPE
-- Execute uma vez no SQL Editor do projeto Supabase usado pelo site.

alter table public.orders
  add column if not exists stripe_livemode boolean,
  add column if not exists stripe_fee_amount numeric(10,2),
  add column if not exists stripe_net_amount numeric(10,2),
  add column if not exists stripe_balance_currency text,
  add column if not exists stripe_financials_synced_at timestamptz;

-- Identifica vendas antigas pelo prefixo cs_live_ ou cs_test_ do Checkout Session.
update public.orders
set stripe_livemode = case
  when left(stripe_checkout_session_id, 8) = 'cs_live_' then true
  when left(stripe_checkout_session_id, 8) = 'cs_test_' then false
  else stripe_livemode
end
where stripe_checkout_session_id is not null
  and stripe_livemode is null;

-- Remove da lista de divergências os checkouts de teste consultados com a chave live.
update public.orders
set stripe_reconciliation_error = null,
    stripe_reconciled_at = now()
where stripe_livemode = false
  and stripe_reconciliation_error like '%No such checkout.session%';
