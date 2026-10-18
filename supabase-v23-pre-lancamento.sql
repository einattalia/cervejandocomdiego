-- Pré-lançamento de cervejas
-- Execute este arquivo uma vez no SQL Editor do Supabase do projeto.
ALTER TABLE public.beers
  ADD COLUMN IF NOT EXISTS is_pre_launch boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pickup_date date;

COMMENT ON COLUMN public.beers.is_pre_launch IS 'Indica que a cerveja está em pré-lançamento.';
COMMENT ON COLUMN public.beers.pickup_date IS 'Data a partir da qual o cliente pode retirar a cerveja em pré-lançamento.';
