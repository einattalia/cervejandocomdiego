CREATE OR REPLACE FUNCTION public.sync_beer_stock_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.stock_quantity := coalesce(NEW.stock_quantity, 0);
  NEW.stock_status := CASE
    WHEN NEW.stock_quantity = 0 THEN 'sold_out'
    WHEN NEW.stock_quantity BETWEEN 1 AND 3 THEN 'low_stock'
    ELSE 'in_stock'
  END;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_unique_beer_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  IF NEW.slug IS NULL
     OR pg_catalog.btrim(NEW.slug) = ''
     OR EXISTS (
       SELECT 1 FROM public.beers b WHERE b.slug = NEW.slug
     ) THEN
    NEW.slug := 'beer-' || pg_catalog.substr(
      pg_catalog.replace(pg_catalog.gen_random_uuid()::text, '-', ''),
      1,
      12
    );
  END IF;
  RETURN NEW;
END;
$function$;
