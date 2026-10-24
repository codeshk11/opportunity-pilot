import {
  IconBriefcase,
  IconBuildingBank,
  IconCode,
  IconSchool,
} from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

import type { Tone } from './tones'

// The kinds of opportunity OppPilot tracks. The values match the database's
// `listings.type` and `profiles.interests` checks.
export const OPPORTUNITY_TYPES = [
  'scholarships',
  'internships',
  'hackathons',
  'govt schemes',
] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]

export const OPPORTUNITY_TYPE_META: Record<
  OpportunityType,
  { label: string; icon: Icon; tone: Tone }
> = {
  scholarships: { label: 'Scholarships', icon: IconSchool, tone: 'mint' },
  internships: { label: 'Internships', icon: IconBriefcase, tone: 'sky' },
  hackathons: { label: 'Hackathons', icon: IconCode, tone: 'lavender' },
  'govt schemes': {
    label: 'Govt schemes',
    icon: IconBuildingBank,
    tone: 'peach',
  },
}
