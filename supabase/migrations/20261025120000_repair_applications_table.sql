-- Repair migration: ensure the applications table exists before adding tracker fields.
-- Safe to run more than once in Supabase SQL Editor.
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_title text not null check (char_length(opportunity_title) between 1 and 300),
  opportunity_url text not null,
  opportunity_type text not null,
  applicant_name text not null check (char_length(applicant_name) between 1 and 100),
  applicant_email text not null check (char_length(applicant_email) between 3 and 254),
  applicant_phone text,
  motivation text,
  shared_fields text[] not null default '{}',
  applied_at timestamptz,
  status text not null default 'saved_in_opppilot',
  created_at timestamptz not null default now(),
  status_updated_at timestamptz not null default now(),
  unique (user_id, opportunity_url)
);

alter table public.applications
  add column if not exists shared_fields text[] not null default '{}',
  add column if not exists applied_at timestamptz,
  add column if not exists status_updated_at timestamptz not null default now();

alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications
  add constraint applications_status_check
  check (status in ('saved_in_opppilot', 'ready_to_review', 'applied', 'waiting', 'result', 'submitted_to_organizer'));

alter table public.applications enable row level security;
grant select, insert, update, delete on public.applications to authenticated;

drop policy if exists own_applications on public.applications;
create policy own_applications on public.applications
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists applications_user_created_idx
  on public.applications (user_id, created_at desc);
create index if not exists applications_user_status_updated_idx
  on public.applications (user_id, status_updated_at desc);

-- Refresh PostgREST's schema cache after creating/updating the table.
notify pgrst, 'reload schema';
