import { useSuspenseQuery } from '@tanstack/react-query'

import { InterestsCard } from './interests-card'
import { NextStepsCard } from './next-steps-card'
import { ProfileCard } from './profile-card'
import { WelcomeCard } from './welcome-card'
import { profileQueryOptions } from '@/features/profile/hooks/query-options'

// The dashboard bento grid. The route only renders it for completed profiles.
export function DashboardBody() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions)
  if (!profile) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <div className="grid gap-4 md:grid-cols-6 md:gap-5">
        <WelcomeCard
          name={profile.name ?? 'there'}
          className="md:col-span-4 md:row-span-2"
        />
        <ProfileCard profile={profile} className="md:col-span-2" />
        <InterestsCard profile={profile} className="md:col-span-2" />
        <NextStepsCard className="md:col-span-6" />
      </div>
    </section>
  )
}
