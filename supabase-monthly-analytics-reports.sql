-- Arquivo dos resumos mensais gerados pelo Vercel Cron.
-- Execute depois de supabase-analytics.sql.

create table if not exists public.analytics_monthly_reports (
  report_month date primary key,
  period_end date not null,
  current_data jsonb not null,
  previous_data jsonb not null,
  recommendations jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  constraint analytics_monthly_reports_month_start check (extract(day from report_month) = 1)
);

alter table public.analytics_monthly_reports enable row level security;
revoke all on table public.analytics_monthly_reports from public, anon, authenticated;
grant select on table public.analytics_monthly_reports to authenticated;
grant select, insert, update on table public.analytics_monthly_reports to service_role;
grant select on table public.analytics_events, public.orders to service_role;

drop policy if exists "Admins read monthly analytics reports" on public.analytics_monthly_reports;
create policy "Admins read monthly analytics reports" on public.analytics_monthly_reports
  for select to authenticated using (public.is_admin((select auth.uid())));

-- O cron usa service_role para chamar esta função agregadora.
grant execute on function public.get_admin_analytics(timestamptz,timestamptz) to service_role;
