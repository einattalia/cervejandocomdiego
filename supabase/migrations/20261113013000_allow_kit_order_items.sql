-- Kits are catalog items in their own right and may not have a beer_id.
-- Their identity is stored in kit_id, with the composition preserved in components_snapshot.
ALTER TABLE public.order_items
  ALTER COLUMN beer_id DROP NOT NULL;
