CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_title text NOT NULL CHECK (char_length(opportunity_title) BETWEEN 1 AND 300),
  opportunity_url text NOT NULL,
  opportunity_type text NOT NULL,
  applicant_name text NOT NULL CHECK (char_length(applicant_name) BETWEEN 1 AND 100),
  applicant_email text NOT NULL CHECK (char_length(applicant_email) BETWEEN 3 AND 254),
  applicant_phone text,
  motivation text,
  status text NOT NULL DEFAULT 'saved_in_opppilot' CHECK (status IN ('saved_in_opppilot','ready_to_review','submitted_to_organizer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_url)
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
CREATE POLICY own_applications ON public.applications FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX applications_user_created_idx ON public.applications(user_id, created_at DESC);
