-- OppPilot application tracker support.
-- Run through Supabase migrations or paste into the Supabase SQL Editor.
alter table public.applications
  add column if not exists status_updated_at timestamptz not null default now();

update public.applications
set status_updated_at = coalesce(status_updated_at, created_at, now())
where status_updated_at is null;

create index if not exists applications_user_status_updated_at_idx
  on public.applications (user_id, status_updated_at desc);
