import { z } from 'zod'

import {
  CATEGORIES,
  INCOME_RANGES,
  INDIAN_STATES,
  MAX_SKILLS,
  MAX_SKILL_LENGTH,
  YEARS,
} from '../constants'
import { OPPORTUNITY_TYPES } from '@/constants/opportunity-types'

// Required free text, trimmed, up to `max` characters.
export function requiredText(max: number) {
  return z
    .string()
    .trim()
    .min(1, 'Please fill in this field.')
    .max(max, `Keep this under ${max} characters.`)
}

// The completed student profile that `saveProfile` accepts. It mirrors the
// check constraints on `public.profiles`.
export const profileSchema = z.object({
  name: requiredText(100),
  college: requiredText(200),
  branch: requiredText(100),
  year: z.enum(YEARS),
  state: z.enum(INDIAN_STATES),
  category: z.enum(CATEGORIES),
  family_income_range: z.enum(INCOME_RANGES),
  cgpa: z.number().min(0).max(10),
  interests: z
    .array(z.enum(OPPORTUNITY_TYPES))
    .min(1, 'Choose at least one interest.')
    .max(OPPORTUNITY_TYPES.length),
  skills: z.array(requiredText(MAX_SKILL_LENGTH)).max(MAX_SKILLS),
})

export type ProfileInput = z.output<typeof profileSchema>
