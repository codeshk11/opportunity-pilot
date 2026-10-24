import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

// Returns only onboarding fields that users may want to reuse on opportunity forms.
// This is called by the signed-in user and is never publicly exposed.
export const getAutofillProfile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profile, error } = await context.supabase
      .from('profiles')
      .select('name, college, branch, year, state, category, family_income_range, cgpa, interests, skills')
      .eq('user_id', context.userId)
      .maybeSingle()

    if (error || !profile) {
      throw new Error('Could not load your profile. Please try again.')
    }

    return {
      name: profile.name ?? '',
      college: profile.college ?? '',
      branch: profile.branch ?? '',
      year: profile.year ?? '',
      state: profile.state ?? '',
      category: profile.category ?? '',
      family_income_range: profile.family_income_range ?? '',
      cgpa: profile.cgpa == null ? '' : String(profile.cgpa),
      interests: profile.interests ?? [],
      skills: profile.skills ?? [],
      exportedAt: new Date().toISOString(),
    }
  })
