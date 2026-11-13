-- Rate-limit public checkout attempts by a keyed IP hash.
CREATE TABLE public.checkout_rate_limits (
  bucket_key text PRIMARY KEY,
  window_started_at timestamptz NOT NULL,
  attempts integer NOT NULL CHECK (attempts > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.checkout_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.checkout_rate_limits FROM PUBLIC, anon, authenticated;
CREATE INDEX checkout_rate_limits_updated_at_idx
  ON public.checkout_rate_limits (updated_at);

CREATE OR REPLACE FUNCTION public.consume_checkout_rate_limit(
  p_bucket_key text,
  p_max_attempts integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_allowed boolean;
BEGIN
  IF p_bucket_key IS NULL OR length(p_bucket_key) <> 64
     OR p_max_attempts < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'Invalid checkout rate limit parameters';
  END IF;

  INSERT INTO public.checkout_rate_limits (
    bucket_key, window_started_at, attempts, updated_at
  )
  VALUES (p_bucket_key, now(), 1, now())
  ON CONFLICT (bucket_key) DO UPDATE
  SET attempts = CASE
        WHEN public.checkout_rate_limits.window_started_at
             <= now() - make_interval(secs => p_window_seconds) THEN 1
        ELSE public.checkout_rate_limits.attempts + 1
      END,
      window_started_at = CASE
        WHEN public.checkout_rate_limits.window_started_at
             <= now() - make_interval(secs => p_window_seconds) THEN now()
        ELSE public.checkout_rate_limits.window_started_at
      END,
      updated_at = now()
  RETURNING attempts <= p_max_attempts INTO v_allowed;

  DELETE FROM public.checkout_rate_limits
  WHERE updated_at < now() - interval '24 hours';

  RETURN v_allowed;
END;
$function$;

REVOKE ALL ON FUNCTION public.consume_checkout_rate_limit(text, integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_checkout_rate_limit(text, integer, integer)
  TO service_role;
