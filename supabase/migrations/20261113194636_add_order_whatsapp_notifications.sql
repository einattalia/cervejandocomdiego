ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS whatsapp_order_updates_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_order_notification_status text NOT NULL DEFAULT 'pending'
    CHECK (whatsapp_order_notification_status IN ('pending', 'sending', 'sent', 'failed')),
  ADD COLUMN IF NOT EXISTS whatsapp_order_notification_attempted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS whatsapp_order_notification_sent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS whatsapp_order_notification_error text;
