import { createServerFn } from '@tanstack/react-start'

import { profileSchema } from '../schemas/profile'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

// The caller's profile row, or null if it does not exist yet. The user ID
// always comes from the verified token, never from the request body.
export const getProfile = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', context.userId)
      .maybeSingle()
    if (error) {
      throw new Error('Your profile could not be loaded. Please try again.')
    }
    return data
  })

// Saves a completed profile and marks onboarding done.
export const saveProfile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .validator(profileSchema)
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from('profiles').upsert({
      ...data,
      user_id: context.userId,
      completed_at: new Date().toISOString(),
    })
    if (error) {
      throw new Error('Your profile could not be saved. Please try again.')
    }
    return { saved: true }
  })
