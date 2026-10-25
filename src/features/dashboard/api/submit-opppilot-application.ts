import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

type SubmitInput = {
  title: string
  url: string
  type: string
  name: string
  email: string
  phone?: string
  motivation?: string
}

// Safety gate: agents may help prepare and explain an application, but must never
// approve or perform the final submission. The student submits on the organiser site.
export const submitOppPilotApplication = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .validator((input: SubmitInput) => input)
  .handler(async ({ data }) => {
    let destination: URL
    try {
      destination = new URL(data.url)
    } catch {
      throw new Error('This opportunity does not have a valid application URL.')
    }
    if (!['http:', 'https:'].includes(destination.protocol)) {
      throw new Error('Only public HTTP or HTTPS application pages are supported.')
    }

    return {
      submitted: false,
      status: 'student_action_required',
      confirmationMessage: '',
      missingFields: [],
      finalUrl: destination.toString(),
      summary: 'Student approval is required. OppPilot does not submit applications on your behalf. Review the official organiser page, check all details and fees, and press Submit yourself if you choose to apply.',
    }
  })
