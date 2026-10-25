-- Student-controlled application tracking and "Who has my data?" ledger.
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS shared_fields text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS applied_at timestamptz,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE public.applications
  ADD CONSTRAINT applications_status_check
  CHECK (status IN ('saved_in_opppilot','ready_to_review','applied','waiting','result','submitted_to_organizer'));

CREATE INDEX IF NOT EXISTS applications_user_status_updated_idx
  ON public.applications(user_id, status_updated_at DESC);

-- Existing RLS policy already limits every row to its owner.
