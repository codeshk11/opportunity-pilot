import { createServerFn } from '@tanstack/react-start'

import { env } from '@/env'
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

type AgentResult = {
  submission_status?: string
  confirmation_message?: string
  missing_fields?: string[]
  final_url?: string
  summary?: string
}

function parseAgentResult(raw: string): { status: string; result: AgentResult | null } {
  const events = raw
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => {
      try {
        return JSON.parse(line.slice(5).trim()) as Record<string, unknown>
      } catch {
        return null
      }
    })
    .filter((event): event is Record<string, unknown> => Boolean(event))

  const complete = [...events].reverse().find((event) => event['type'] === 'COMPLETE')
  if (!complete) {
    const failed = [...events].reverse().find((event) => event['type'] === 'ERROR' || event['status'] === 'FAILED')
    throw new Error(typeof failed?.['message'] === 'string' ? failed['message'] : 'TinyFish could not complete the application workflow.')
  }

  const rawResult = complete['resultJson']
  let result: AgentResult | null = null
  if (typeof rawResult === 'string') {
    try { result = JSON.parse(rawResult) as AgentResult } catch { result = { summary: rawResult } }
  } else if (rawResult && typeof rawResult === 'object') {
    result = rawResult as AgentResult
  }

  return { status: String(complete['status'] ?? ''), result }
}

// Uses TinyFish to complete the organiser's official application page.
// The user must explicitly click the submit button for each application.
export const submitOppPilotApplication = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .validator((input: SubmitInput) => input)
  .handler(async ({ context, data }) => {
    if (!env.TINYFISH_API_KEY) {
      throw new Error('Official submission automation is not configured yet. Add a valid TINYFISH_API_KEY in Vercel project settings.')
    }

    let destination: URL
    try {
      destination = new URL(data.url)
    } catch {
      throw new Error('This opportunity does not have a valid application URL.')
    }
    if (!['http:', 'https:'].includes(destination.protocol)) {
      throw new Error('Only public HTTP or HTTPS application pages are supported.')
    }
    if (!data.name.trim() || !data.email.includes('@')) {
      throw new Error('Enter your full name and a valid email before continuing.')
    }

    const { data: profile, error } = await context.supabase
      .from('profiles')
      .select('college, branch, year, state, category, cgpa, interests, skills')
      .eq('user_id', context.userId)
      .maybeSingle()

    if (error) throw new Error('Could not load your student profile. Please try again.')

    const applicant = {
      full_name: data.name.trim().slice(0, 100),
      email: data.email.trim().slice(0, 254),
      phone: data.phone?.trim().slice(0, 40) || '',
      motivation: data.motivation?.trim().slice(0, 3000) || '',
      college: profile?.college ?? '',
      branch: profile?.branch ?? '',
      academic_year: profile?.year ?? '',
      state: profile?.state ?? '',
      category: profile?.category ?? '',
      cgpa: profile?.cgpa == null ? '' : String(profile.cgpa),
      interests: profile?.interests ?? [],
      skills: profile?.skills ?? [],
    }

    const goal = [
      'You are completing an application on behalf of the signed-in applicant for the opportunity below.',
      'Open and inspect the official application page. Use only the applicant data supplied below.',
      'Fill fields that clearly match the supplied data. Do not invent answers, credentials, dates, grades, work history, references, or documents.',
      'Only provide category or CGPA if the official form explicitly asks for it. Never expose information in unrelated fields.',
      'If the site requires a missing document, account login, OTP, CAPTCHA, payment, or an answer not present in the supplied data, STOP without submitting and report exactly what is needed.',
      'If the form is fully filled and no missing requirement or blocker remains, submit it. Do not bypass security controls or site restrictions.',
      'Return JSON only with this shape: {"submission_status":"submitted"|"not_submitted"|"blocked","confirmation_message":"...","missing_fields":["..."],"final_url":"...","summary":"..."}.',
      'Set submission_status to "submitted" only if the website visibly confirms successful submission or provides a confirmation/reference number. Otherwise use "not_submitted" or "blocked".',
      '',
      'Opportunity:',
      JSON.stringify({ title: data.title, type: data.type, official_application_url: destination.toString() }),
      'Applicant data:',
      JSON.stringify(applicant),
    ].join('\n')

    const response = await fetch('https://agent.tinyfish.ai/v1/automation/run-sse', {
      method: 'POST',
      headers: {
        'X-API-Key': env.TINYFISH_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ url: destination.toString(), goal }),
      signal: AbortSignal.timeout(180_000),
    })

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500)
      console.error('[submitOppPilotApplication] TinyFish request failed', response.status, detail)
      throw new Error(`TinyFish application automation failed (${response.status}). Please try again or use the official page.`)
    }

    const raw = await response.text()
    const parsed = parseAgentResult(raw)
    const result = parsed.result
    const submitted = parsed.status === 'COMPLETED' && result?.submission_status === 'submitted'

    return {
      submitted,
      status: submitted ? 'submitted_to_organizer' : (result?.submission_status ?? 'not_submitted'),
      confirmationMessage: result?.confirmation_message ?? '',
      missingFields: result?.missing_fields ?? [],
      finalUrl: result?.final_url ?? destination.toString(),
      summary: result?.summary ?? 'The organiser website did not return a clear submission confirmation.',
    }
  })
