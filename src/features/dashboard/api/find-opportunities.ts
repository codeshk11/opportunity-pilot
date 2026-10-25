import { createServerFn } from '@tanstack/react-start'

import { env } from '@/env'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export type OpportunityRegion = 'Your state' | 'Across India' | 'International' | 'Not specified'
export type OpportunityYear = '1st year' | '2nd year' | 'All years' | 'Other years' | 'Not specified'
export type OpportunityCost = 'Free' | 'Paid' | 'Not specified'
export type FeeRisk = 'Money requested' | 'No fee language found'

export type OpportunitySearchResult = {
  title: string
  url: string
  snippet: string
  siteName: string
  type: string
  region: OpportunityRegion
  eligibleYears: OpportunityYear[]
  cost: OpportunityCost
  feeRisk: FeeRisk
  feeWarning: string | null
  deadline: string | null
  detailsChecked: boolean
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

type TinyFishFetchItem = {
  url?: unknown
  final_url?: unknown
  title?: unknown
  text?: unknown
  content?: unknown
  markdown?: unknown
  raw_content?: unknown
}

type TinyFishFetchResponse = {
  results?: TinyFishFetchItem[]
  data?: TinyFishFetchItem[]
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
  if (/\b(worldwide applicants|open internationally|international applicants|open to international students|applicants from any country|students from all countries|multiple countries)\b/.test(normalized)) {
    return 'International'
  }

  if (
    /\b(pan[- ]india|across india|all over india|nationwide in india|anywhere in india|students across india|all indian states|indian citizens|indian nationals|citizens of india|residents of india|students in india)\b/.test(normalized)
  ) return 'Across India'

  if (state) {
    const stateName = state.toLowerCase().trim()
    if (
      normalized.includes('in ' + stateName) ||
      normalized.includes('from ' + stateName) ||
      normalized.includes('within ' + stateName) ||
      normalized.includes(stateName + ' residents') ||
      normalized.includes(stateName + ' students') ||
      normalized.includes(stateName + ' colleges') ||
      normalized.includes(stateName + ' universities')
    ) return 'Your state'
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

function detectFeeRisk(text: string): { feeRisk: FeeRisk; feeWarning: string | null } {
  const normalized = text.replace(/\\s+/g, ' ')
  const moneyRequest = /\\b(?:pay|payment|paid|fee|fees|charges?|deposit|purchase|buy|costs?)\\b.{0,70}\\b(?:to confirm|to secure|to reserve|to register|registration|enrol(?:l)?ment|internship|training|certificate|selection|offer|joining|onboarding|seat|application)\\b|\\b(?:registration fee|joining fee|training fee|course fee|security deposit|pay to confirm|payment required|fee required|payable to proceed|processing fee|refundable deposit|pay for certificate)\\b|(?:₹|\\bINR\\s?|\\bRs\\.?\\s?)\\s?[\\d,]+/i;
  const match = normalized.match(moneyRequest)
  if (match) {
    const start = Math.max(0, (match.index ?? 0) - 65)
    const end = Math.min(normalized.length, (match.index ?? 0) + match[0].length + 65)
    return {
      feeRisk: 'Money requested',
      feeWarning: normalized.slice(start, end).trim(),
    }
  }
  return { feeRisk: 'No fee language found', feeWarning: null }
}

function classifyCost(text: string): OpportunityCost {
  const normalized = text.toLowerCase()
  const explicitlyFree =
    /\b(no|without)\s+(an?\s+)?(application|registration|participation|program|course)\s+fee\b/.test(normalized) ||
    /\b(free to apply|free registration|free to participate|completely free|fully free|free of charge|free of cost|zero fees?|no fee required|no registration charges|no participation fee)\b/.test(normalized)
  if (explicitlyFree) return 'Free'

  const explicitlyPaid =
    /\b(paid registration|application fee of|registration fee of|participation fee of|program fee of|course fee of|fee required|fee applies|paid program|registration charges apply|registration fee applies)\b/.test(normalized) ||
    /(?:₹|\binr\s?|\brs\.?\s?)\s?[\d,]+/i.test(normalized)
  if (explicitlyPaid) return 'Paid'

  return 'Not specified'
}

// Extract a deadline only when a date appears close to explicit deadline wording.
// Returns YYYY-MM-DD so the UI can calculate the countdown from the current date.
function extractDeadline(text: string): string | null {
  const datePattern = /\b(?:\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\b/gi
  const deadlineWords = /deadline|last date|last day to apply|apply by|closing date|application closes|applications close|registration closes|submission closes|due date|must apply by/i
  const monthNames: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  }
  const candidates: string[] = []
  for (const match of text.matchAll(datePattern)) {
    const index = match.index ?? 0
    const context = text.slice(Math.max(0, index - 100), Math.min(text.length, index + match[0].length + 100))
    if (!deadlineWords.test(context)) continue
    const raw = match[0].replace(/,/g, '').trim()
    let year: number
    let month: number
    let day: number
    let parsed = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (parsed) {
      year = Number(parsed[1]!); month = Number(parsed[2]!) - 1; day = Number(parsed[3]!)
    } else if ((parsed = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/))) {
      // Indian date convention: DD/MM/YYYY.
      day = Number(parsed[1]!); month = Number(parsed[2]!) - 1; year = Number(parsed[3]!)
    } else if ((parsed = raw.match(/^([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})$/))) {
      month = monthNames[parsed[1]!.slice(0, 3).toLowerCase()] ?? -1
      day = Number(parsed[2]!); year = Number(parsed[3]!)
    } else if ((parsed = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/))) {
      day = Number(parsed[1]!); month = monthNames[parsed[2]!.slice(0, 3).toLowerCase()] ?? -1; year = Number(parsed[3]!)
    } else {
      continue
    }
    const date = new Date(Date.UTC(year, month, day))
    if (month < 0 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) continue
    candidates.push(date.toISOString().slice(0, 10))
  }
  const today = new Date()
  const todayIso = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toISOString().slice(0, 10)
  return candidates.filter((date) => date >= todayIso).sort()[0] ?? candidates.sort().at(-1) ?? null
}

async function fetchOfficialPageText(urls: string[]): Promise<Map<string, string>> {
  const pageTextByUrl = new Map<string, string>()
  const batches: string[][] = []
  for (let index = 0; index < urls.length; index += 10) {
    batches.push(urls.slice(index, index + 10))
  }

  await Promise.all(batches.map(async (batch) => {
    try {
      const response = await fetch('https://api.fetch.tinyfish.ai', {
        method: 'POST',
        headers: {
          'X-API-Key': env.TINYFISH_API_KEY!,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ urls: batch }),
        signal: AbortSignal.timeout(35_000),
      })
      if (!response.ok) return

      const payload = (await response.json()) as TinyFishFetchResponse
      const items = payload.results ?? payload.data ?? []
      for (const item of items) {
        const returnedUrl =
          typeof item.final_url === 'string' ? item.final_url :
          typeof item.url === 'string' ? item.url : ''
        const textContent =
          typeof item.text === 'string' ? item.text :
          typeof item.content === 'string' ? item.content :
          typeof item.markdown === 'string' ? item.markdown :
          typeof item.raw_content === 'string' ? item.raw_content : ''
        if (returnedUrl && textContent.trim()) {
          pageTextByUrl.set(returnedUrl, textContent.slice(0, 18_000))
        }
      }
    } catch {
      // Search results still work if an official page cannot be fetched.
    }
  }))

  return pageTextByUrl
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
            ...detectFeeRisk(evidence),
            deadline: extractDeadline(evidence),
          }
        })
    })

    const groups = await Promise.all(searches)
    const unique = new Map<string, Omit<OpportunitySearchResult, 'detailsChecked'>>()
    for (const result of groups.flat()) {
      if (!unique.has(result.url)) unique.set(result.url, result)
    }

    const discovered = [...unique.values()].slice(0, 24)
    // Read the actual opportunity pages so filters use more than search snippets.
    const pageTextByUrl = await fetchOfficialPageText(discovered.map((item) => item.url))

    return discovered.map((item) => {
      const pageText = pageTextByUrl.get(item.url)
      const evidence = pageText ? `${item.title} ${item.snippet} ${pageText}` : `${item.title} ${item.snippet}`
      return {
        ...item,
        region: classifyRegion(evidence, profile.state),
        eligibleYears: classifyYears(evidence),
        cost: classifyCost(evidence),
        ...detectFeeRisk(evidence),
        deadline: extractDeadline(evidence),
        detailsChecked: Boolean(pageText),
        snippet: item.snippet,
      }
    })
  })
