import { describe, expect, it } from 'vitest'

import { profileDestination } from '../utils/profile-destination'
import { profileSchema } from './profile'
import type { ProfileInput } from './profile'

const completeProfile: ProfileInput = {
  name: 'Esha',
  college: 'IGDTUW',
  branch: 'Computer Science',
  year: '2nd',
  state: 'Delhi',
  category: 'General',
  family_income_range: 'Below ₹1 lakh',
  cgpa: 8.5,
  interests: ['scholarships'],
  skills: ['Python'],
}

describe('profileDestination', () => {
  it('sends users with no profile to onboarding', () => {
    expect(profileDestination(null)).toBe('/onboarding')
  })

  it('sends the empty signup profile to onboarding', () => {
    expect(profileDestination({ completed_at: null })).toBe('/onboarding')
  })

  it('sends completed profiles to the dashboard', () => {
    expect(profileDestination({ completed_at: '2026-10-24T08:00:00Z' })).toBe(
      '/dashboard',
    )
  })
})

describe('profileSchema', () => {
  it('accepts a complete profile', () => {
    expect(profileSchema.safeParse(completeProfile).success).toBe(true)
  })

  it.each([
    ['year', '5th'],
    ['category', 'Other'],
    ['cgpa', 11],
    ['interests', []],
    ['interests', ['jobs']],
  ])('rejects %s = %j', (key, value) => {
    expect(
      profileSchema.safeParse({ ...completeProfile, [key]: value }).success,
    ).toBe(false)
  })
})
