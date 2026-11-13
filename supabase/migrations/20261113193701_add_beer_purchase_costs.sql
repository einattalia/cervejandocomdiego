CREATE TABLE IF NOT EXISTS public.beer_purchase_costs (
  beer_id uuid PRIMARY KEY REFERENCES public.beers(id) ON DELETE CASCADE,
  purchase_cost numeric(10, 2) NOT NULL CHECK (purchase_cost >= 0),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.beer_purchase_costs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.beer_purchase_costs FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.beer_purchase_costs TO authenticated;

DROP POLICY IF EXISTS "admins read beer purchase costs" ON public.beer_purchase_costs;
CREATE POLICY "admins read beer purchase costs"
  ON public.beer_purchase_costs FOR SELECT TO authenticated
  USING (public.is_admin((SELECT auth.uid())));

DROP POLICY IF EXISTS "admins insert beer purchase costs" ON public.beer_purchase_costs;
CREATE POLICY "admins insert beer purchase costs"
  ON public.beer_purchase_costs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin((SELECT auth.uid())));

DROP POLICY IF EXISTS "admins update beer purchase costs" ON public.beer_purchase_costs;
CREATE POLICY "admins update beer purchase costs"
  ON public.beer_purchase_costs FOR UPDATE TO authenticated
  USING (public.is_admin((SELECT auth.uid())))
  WITH CHECK (public.is_admin((SELECT auth.uid())));

DROP POLICY IF EXISTS "admins delete beer purchase costs" ON public.beer_purchase_costs;
CREATE POLICY "admins delete beer purchase costs"
  ON public.beer_purchase_costs FOR DELETE TO authenticated
  USING (public.is_admin((SELECT auth.uid())));
