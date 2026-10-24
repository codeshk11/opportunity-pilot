import { z } from 'zod'

import type { ProfileInput } from '@/features/profile/schemas/profile'
import type { Profile } from '@/features/profile/types'
import { OPPORTUNITY_TYPES } from '@/constants/opportunity-types'
import {
  CATEGORIES,
  INCOME_RANGES,
  INDIAN_STATES,
  MAX_SKILLS,
  YEARS,
} from '@/features/profile/constants'
import { requiredText } from '@/features/profile/schemas/profile'

// A form-side choice: it starts as '' and must end as one of `values`.
function choiceOf<const TValues extends readonly [string, ...Array<string>]>(
  values: TValues,
  message: string,
) {
  return z.string().pipe(z.enum(values, { error: message }))
}

// =============================================================================
// Step schemas
// =============================================================================
// Each step validates its own form. Inputs are what the controls hold
// (strings); outputs are the typed profile fields.

export const campusStepSchema = z.object({
  name: requiredText(100),
  college: requiredText(200),
  branch: requiredText(100),
  year: choiceOf(YEARS, 'Choose your year.'),
  state: choiceOf(INDIAN_STATES, 'Choose your state.'),
})

export const backgroundStepSchema = z.object({
  category: choiceOf(CATEGORIES, 'Choose your category.'),
  family_income_range: choiceOf(INCOME_RANGES, 'Choose an income range.'),
  cgpa: z
    .string()
    .trim()
    .min(1, 'Enter your CGPA.')
    .transform(Number)
    .pipe(
      z
        .number({ error: 'Enter a number, like 8.5.' })
        .min(0, 'CGPA starts at 0.')
        .max(10, 'CGPA is out of 10.'),
    ),
})

export const ambitionsStepSchema = z.object({
  interests: z
    .array(z.string().pipe(z.enum(OPPORTUNITY_TYPES)))
    .min(1, 'Choose at least one.'),
  skills: z.array(z.string()).max(MAX_SKILLS),
})

export type CampusStepValues = z.input<typeof campusStepSchema>
export type BackgroundStepValues = z.input<typeof backgroundStepSchema>
export type AmbitionsStepValues = z.input<typeof ambitionsStepSchema>

export interface OnboardingValues {
  campus: CampusStepValues
  background: BackgroundStepValues
  ambitions: AmbitionsStepValues
}

// Starts the wizard from whatever the profile already holds.
export function getDefaultOnboardingValues(
  profile: Profile | null,
): OnboardingValues {
  return {
    campus: {
      name: profile?.name ?? '',
      college: profile?.college ?? '',
      branch: profile?.branch ?? '',
      year: profile?.year ?? '',
      state: profile?.state ?? '',
    },
    background: {
      category: profile?.category ?? '',
      family_income_range: profile?.family_income_range ?? '',
      cgpa: profile?.cgpa?.toString() ?? '',
    },
    ambitions: {
      interests: profile?.interests ?? [],
      skills: profile?.skills ?? [],
    },
  }
}

// The profile `saveProfile` takes, from the three validated steps.
export function toProfileInput(values: OnboardingValues): ProfileInput {
  return {
    ...campusStepSchema.parse(values.campus),
    ...backgroundStepSchema.parse(values.background),
    ...ambitionsStepSchema.parse(values.ambitions),
  }
}
