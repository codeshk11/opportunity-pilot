import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export type TrackedApplication = {
  id: string
  opportunity_title: string
  opportunity_url: string
  opportunity_type: string | null
  status: string
  created_at: string
  status_updated_at: string
}

export const getMyApplications = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TrackedApplication[]> => {
    const db = context.supabase as any
    const { data, error } = await db
      .from('applications')
      .select('id, opportunity_title, opportunity_url, opportunity_type, status, created_at, status_updated_at')
      .eq('user_id', context.userId)
      .order('status_updated_at', { ascending: false })

    if (error) {
      console.error('[getMyApplications] Supabase query failed', { code: error.code, message: error.message })
      throw new Error('Could not load My Applications. Please refresh and try again.')
    }

    return (data ?? []) as TrackedApplication[]
  })
