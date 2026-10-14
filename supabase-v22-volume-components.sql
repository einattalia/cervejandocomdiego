-- Adds optional capacity in milliliters to inventory components such as cups.
alter table public.inventory_items
  add column if not exists volume_ml integer
  check (volume_ml is null or volume_ml > 0);

comment on column public.inventory_items.volume_ml is
  'Optional capacity in milliliters for glassware inventory components.';

notify pgrst, 'reload schema';

