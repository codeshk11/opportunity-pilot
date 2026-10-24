import { IconId, IconRocket, IconSchool } from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

import type { Tone } from '@/constants/tones'
import {
  CATEGORIES,
  INCOME_RANGES,
  INDIAN_STATES,
  YEARS,
  YEAR_LABELS,
} from '@/features/profile/constants'
import { formatIncomeRange } from '@/features/profile/utils/format-income-range'

export const ONBOARDING_MUTATION_KEY = {
  complete: 'onboarding-complete',
} as const

export const ONBOARDING_STEPS: ReadonlyArray<{
  title: string
  description: string
  icon: Icon
  tone: Tone
}> = [
  {
    title: 'Your campus',
    description: 'Where and what you study',
    icon: IconSchool,
    tone: 'mint',
  },
  {
    title: 'Your background',
    description: 'What eligibility depends on',
    icon: IconId,
    tone: 'peach',
  },
  {
    title: 'Your ambitions',
    description: 'What you are looking for',
    icon: IconRocket,
    tone: 'sky',
  },
]

export const YEAR_OPTIONS = YEARS.map((year) => ({
  value: year,
  label: YEAR_LABELS[year],
}))

export const STATE_OPTIONS = INDIAN_STATES.map((state) => ({
  value: state,
  label: state,
}))

export const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

export const INCOME_OPTIONS = INCOME_RANGES.map((range) => ({
  value: range,
  label: formatIncomeRange(range),
}))
