import { createServerFn } from '@tanstack/react-start'

import { env } from '@/env'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export type OpportunityRegion = 'Your state' | 'Across India' | 'International' | 'Not specified'
export type OpportunityYear = '1st year' | '2nd year' | 'All years' | 'Other years' | 'Not specified'
export type OpportunityCost = 'Free' | 'Paid' | 'Not specified'

export type OpportunitySearchResult = {
  title: string
  url: string
  snippet: string
  siteName: string
  type: string
  region: OpportunityRegion
  eligibleYears: OpportunityYear[]
  cost: OpportunityCost
}

type TinyFishSearchItem = {
  title?: unknown
  url?: unknown
  snippet?: unknown
  site_name?: unknown
  siteName?: unknown
}

type TinyFishSearchResponse = {
  results?: TinyFishSearchItem[]
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function classifyRegion(text: string, state?: string | null): OpportunityRegion {
  const normalized = text.toLowerCase()
  if (/\b(international|global|worldwide|abroad|overseas|foreign students|multiple countries)\b/.test(normalized)) {
    return 'International'
  }
  if (state && normalized.includes(state.toLowerCase())) return 'Your state'
  if (/\b(across india|all india|india-wide|nationwide|national level|pan-india|students across india)\b/.test(normalized)) {
    return 'Across India'
  }
  return 'Not specified'
}

function classifyYears(text: string): OpportunityYear[] {
  const normalized = text.toLowerCase()
  const first = /\b(first[- ]year|1st[- ]year|year 1|freshman|first year students)\b/.test(normalized)
  const second = /\b(second[- ]year|2nd[- ]year|year 2|sophomore|second year students)\b/.test(normalized)
  const other = /\b(third[- ]year|3rd[- ]year|fourth[- ]year|4th[- ]year|final[- ]year|year 3|year 4)\b/.test(normalized)
  if (/\b(all years|any year|all academic years|open to students of every year|students from any year)\b/.test(normalized)) return ['All years']

  const years: OpportunityYear[] = []
  if (first) years.push('1st year')
  if (second) years.push('2nd year')
  if (other) years.push('Other years')
  return years.length ? years : ['Not specified']
}

function classifyCost(text: string): OpportunityCost {
  const normalized = text.toLowerCase()
  const explicitlyFree = /\b(no|without)\s+(an?\s+)?(application|registration|participation|program|course)\s+fee\b|\b(free to apply|free registration|completely free|fully free|free of charge|free of cost|zero fees?|no fee required)\b/.test(normalized)
  if (explicitlyFree) return 'Free'

  const explicitlyPaid = /\b(paid registration|application fee of|registration fee of|participation fee of|program fee of|course fee of|fee required|fee applies|paid program)\b|(?:₹|\binr\s?|\brs\.?\s?)\s?[\d,]+/i.test(normalized)
  if (explicitlyPaid) return 'Paid'
  return 'Not specified'
}

// Searches TinyFish from the server using the signed-in student's saved profile.
// The API key never enters the browser bundle or the request payload.
export const findOpportunities = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OpportunitySearchResult[]> => {
    if (!env.TINYFISH_API_KEY) {
      throw new Error(
        'TinyFish is not configured yet. Add TINYFISH_API_KEY to the deployment environment.',
      )
    }

    const { data: profile, error } = await context.supabase
      .from('profiles')
      .select('college, branch, year, state, category, interests, skills')
      .eq('user_id', context.userId)
      .maybeSingle()

    if (error || !profile || !profile.interests.length) {
      throw new Error('Your student profile could not be loaded. Please complete onboarding and try again.')
    }

    const profileYear = String(profile.year ?? '')
    const profileContext = [
      profile.branch,
      profileYear ? `${profileYear} year college student` : '',
      profile.college,
      profile.state,
      profile.category ? `category ${profile.category}` : '',
      profile.skills.length ? `skills: ${profile.skills.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(', ')

    const searches = profile.interests.map(async (interest) => {
      const query = `current student opportunities in India for ${interest}; suitable for ${profileContext}; include opportunities open to first-year and second-year college students, eligibility by academic year, location/region, application or participation fee (free or paid), deadline, official application page`
      const response = await fetch(
        `https://api.search.tinyfish.ai?query=${encodeURIComponent(query)}&location=IN&language=en`,
        {
          headers: {
            'X-API-Key': env.TINYFISH_API_KEY!,
            Accept: 'application/json',
          },
          signal: AbortSignal.timeout(20_000),
        },
      )

      if (!response.ok) {
        throw new Error(`TinyFish search failed (${response.status}). Please try again.`)
      }

      const payload = (await response.json()) as TinyFishSearchResponse
      return (payload.results ?? [])
        .filter((item) => typeof item.title === 'string' && isHttpUrl(item.url))
        .slice(0, 8)
        .map((item) => {
          const title = String(item.title)
          const snippet = typeof item.snippet === 'string' ? item.snippet : ''
          const url = item.url as string
          const siteName =
            typeof item.site_name === 'string'
              ? item.site_name
              : typeof item.siteName === 'string'
                ? item.siteName
                : new URL(url).hostname
          // Classify only from the title and snippet, not the site's brand name.
          // Search-result text is not official verification, so uncertain details stay unspecified.
          const evidence = `${title} ${snippet}`
          return {
            title,
            url,
            snippet,
            siteName,
            type: interest,
            region: classifyRegion(evidence, profile.state),
            eligibleYears: classifyYears(evidence),
            cost: classifyCost(evidence),
          }
        })
    })

    const groups = await Promise.all(searches)
    const unique = new Map<string, OpportunitySearchResult>()
    for (const result of groups.flat()) {
      if (!unique.has(result.url)) unique.set(result.url, result)
    }

    return [...unique.values()].slice(0, 24)
  })
