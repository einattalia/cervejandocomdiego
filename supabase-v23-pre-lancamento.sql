-- Rode este script uma vez no SQL Editor do Supabase antes de usar o campo no admin.
ALTER TABLE public.beers
  ADD COLUMN IF NOT EXISTS is_pre_launch boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pickup_date date;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'beers_pre_launch_pickup_date_check'
      AND conrelid = 'public.beers'::regclass
  ) THEN
    ALTER TABLE public.beers
      ADD CONSTRAINT beers_pre_launch_pickup_date_check
      CHECK (
        (is_pre_launch AND pickup_date IS NOT NULL)
        OR (NOT is_pre_launch AND pickup_date IS NULL)
      );
  END IF;
END $$;
