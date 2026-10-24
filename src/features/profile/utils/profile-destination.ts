import type { Profile } from '../types'

// Where a signed-in student belongs: only a profile with `completed_at` counts
// as onboarded, so new accounts cannot skip onboarding.
export function profileDestination(
  profile: Pick<Profile, 'completed_at'> | null,
) {
  return profile?.completed_at
    ? ('/dashboard' as const)
    : ('/onboarding' as const)
}
