ALTER TABLE public.orders
  DROP COLUMN IF EXISTS whatsapp_order_updates_opt_in,
  DROP COLUMN IF EXISTS whatsapp_order_notification_status,
  DROP COLUMN IF EXISTS whatsapp_order_notification_attempted_at,
  DROP COLUMN IF EXISTS whatsapp_order_notification_sent_at,
  DROP COLUMN IF EXISTS whatsapp_order_notification_error,
  ADD COLUMN IF NOT EXISTS email_order_notification_status text NOT NULL DEFAULT 'pending'
    CHECK (email_order_notification_status IN ('pending', 'sending', 'sent', 'failed')),
  ADD COLUMN IF NOT EXISTS email_order_notification_attempted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS email_order_notification_sent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS email_order_notification_error text;
