import type { Tables } from '@/integrations/supabase/types'

// A row of `public.profiles`. Signup creates it empty; onboarding fills it in
// and sets `completed_at`.
export type Profile = Tables<'profiles'>
