import { createServerFn } from '@tanstack/react-start'

import { env } from '@/env'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export type OpportunitySearchResult = {
  title: string
  url: string
  snippet: string
  siteName: string
  type: string
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

    const profileContext = [
      profile.branch,
      profile.year ? `${profile.year} year college student` : '',
      profile.college,
      profile.state,
      profile.category ? `category ${profile.category}` : '',
      profile.skills.length ? `skills: ${profile.skills.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(', ')

    const searches = profile.interests.map(async (interest) => {
      const query = `current India ${interest} for ${profileContext}; official application page, eligibility, deadline`
      const response = await fetch(
        `https://api.search.tinyfish.ai?query=${encodeURIComponent(query)}`,
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
        .slice(0, 6)
        .map((item) => ({
          title: String(item.title),
          url: item.url as string,
          snippet: typeof item.snippet === 'string' ? item.snippet : '',
          siteName:
            typeof item.site_name === 'string'
              ? item.site_name
              : typeof item.siteName === 'string'
                ? item.siteName
                : new URL(item.url as string).hostname,
          type: interest,
        }))
    })

    const groups = await Promise.all(searches)
    const unique = new Map<string, OpportunitySearchResult>()
    for (const result of groups.flat()) {
      if (!unique.has(result.url)) unique.set(result.url, result)
    }

    return [...unique.values()].slice(0, 20)
  })
