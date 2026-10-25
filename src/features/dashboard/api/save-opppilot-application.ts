import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

type ApplicationInput = {
  title: string
  url: string
  type: string
  name: string
  email: string
  phone?: string
  motivation?: string
}

// Stores an application record inside OppPilot. This is not represented as an
// official submission to the opportunity organizer.
export const saveOppPilotApplication = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .validator((input: ApplicationInput) => input)
  .handler(async ({ context, data }) => {
    if (!data.title.trim() || !data.url.startsWith('http') || !data.name.trim() || !data.email.includes('@')) {
      throw new Error('Please enter a valid name and email before saving.')
    }

    const db = context.supabase as any
    const { data: saved, error } = await db
      .from('applications')
      .upsert({
        user_id: context.userId,
        opportunity_title: data.title.trim().slice(0, 300),
        opportunity_url: data.url,
        opportunity_type: data.type,
        applicant_name: data.name.trim().slice(0, 100),
        applicant_email: data.email.trim().slice(0, 254),
        applicant_phone: data.phone?.trim().slice(0, 40) || null,
        motivation: data.motivation?.trim().slice(0, 3000) || null,
        status: 'saved_in_opppilot',
        status_updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,opportunity_url' })
      .select('id')
      .single()

    if (error) {
      // Keep the full diagnostic in Vercel logs while surfacing a concise
      // PostgREST error to the signed-in user for faster troubleshooting.
      console.error('[saveOppPilotApplication] Supabase upsert failed', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw new Error(`Could not save this application (${error.code || 'database error'}): ${error.message}`)
    }

    if (!saved) {
      console.error('[saveOppPilotApplication] Supabase returned no saved row')
      throw new Error('OppPilot did not confirm that the application was saved. Please try again.')
    }

    return { id: saved.id }
  })
