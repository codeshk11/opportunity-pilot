import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

type UpdateInput = {
  id: string
  status: 'saved_in_opppilot' | 'applied' | 'waiting' | 'result'
}

export const updateApplicationStatus = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .validator((input: UpdateInput) => input)
  .handler(async ({ context, data }) => {
    const db = context.supabase as any
    const { data: updated, error } = await db
      .from('applications')
      .update({
        status: data.status,
        status_updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)
      .eq('user_id', context.userId)
      .select('id, status, status_updated_at')
      .maybeSingle()

    if (error) {
      console.error('[updateApplicationStatus] Supabase update failed', { code: error.code, message: error.message })
      throw new Error('Could not update this application status. Please try again.')
    }
    if (!updated) throw new Error('Application not found in your account.')
    return updated as { id: string; status: string; status_updated_at: string }
  })
