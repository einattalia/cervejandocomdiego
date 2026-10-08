-- Permite que o webhook autenticado do Stripe execute a função de confirmação.
-- A função continua indisponível para PUBLIC, anon e authenticated.
grant execute on function public.mark_order_paid(uuid, text, text) to service_role;
