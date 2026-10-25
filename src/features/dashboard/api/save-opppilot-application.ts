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
      }, { onConflict: 'user_id,opportunity_url' })
      .select('id')
      .single()

    if (error || !saved) {
      throw new Error('Could not save this application in OppPilot. Please try again.')
    }

    return { id: saved.id }
  })
