-- OppPilot application tracker support.
-- Apply this migration to the Supabase project used by the production app.
alter table public.applications
  add column if not exists status_updated_at timestamptz not null default now();

create index if not exists applications_user_status_updated_at_idx
  on public.applications (user_id, status_updated_at desc);
