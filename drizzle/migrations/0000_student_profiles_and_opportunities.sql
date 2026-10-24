CREATE TABLE public.profiles (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 name text CHECK (char_length(name) BETWEEN 1 AND 100), college text CHECK (char_length(college) BETWEEN 1 AND 200), branch text CHECK (char_length(branch) BETWEEN 1 AND 100),
 year text CHECK (year IN ('1st','2nd','3rd','4th','PG')), state text CHECK (char_length(state) BETWEEN 1 AND 100),
 category text CHECK (category IN ('General','OBC','SC','ST','EWS')),
 family_income_range text CHECK (family_income_range IN ('Below ₹1 lakh','₹1–2.5 lakh','₹2.5–5 lakh','₹5–8 lakh','Above ₹8 lakh')),
 cgpa numeric CHECK (cgpa BETWEEN 0 AND 10), interests text[] NOT NULL DEFAULT '{}', skills text[] NOT NULL DEFAULT '{}', completed_at timestamptz,
 CHECK (interests <@ ARRAY['scholarships','internships','hackathons','govt schemes']::text[]),
 CHECK (cardinality(skills) <= 30),
 CHECK (completed_at IS NULL OR (name IS NOT NULL AND college IS NOT NULL AND branch IS NOT NULL AND year IS NOT NULL AND state IS NOT NULL AND category IS NOT NULL AND family_income_range IS NOT NULL AND cgpa IS NOT NULL AND cardinality(interests) > 0))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE FUNCTION public.create_student_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN INSERT INTO public.profiles(user_id) VALUES (NEW.id); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.create_student_profile() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER student_profile_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_student_profile();
CREATE TABLE public.listings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 300), type text NOT NULL CHECK (type IN ('scholarships','internships','hackathons','govt schemes')),
 url text NOT NULL, deadline timestamptz, eligibility text, documents jsonb NOT NULL DEFAULT '[]', summary text, source_url text, last_verified_at timestamptz
);
GRANT SELECT ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY authenticated_listings ON public.listings FOR SELECT TO authenticated USING (true);
CREATE TABLE public.matches (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE, listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
 score numeric NOT NULL, why_match text, missing jsonb NOT NULL DEFAULT '[]', UNIQUE(user_id, listing_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_matches ON public.matches FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TABLE public.saved (
 user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE, listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE, reminder_date date, PRIMARY KEY(user_id, listing_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved TO authenticated;
GRANT ALL ON public.saved TO service_role;
ALTER TABLE public.saved ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_saved ON public.saved FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TABLE public.agent_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE, run_id uuid NOT NULL, listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE, status text NOT NULL, result jsonb NOT NULL DEFAULT '{}'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_runs TO authenticated;
GRANT ALL ON public.agent_runs TO service_role;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_agent_runs ON public.agent_runs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX agent_runs_user_id_idx ON public.agent_runs(user_id);