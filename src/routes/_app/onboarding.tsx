import { createFileRoute, redirect } from '@tanstack/react-router'

import { PAGE_TITLES } from '@/constants/page-titles'
import { OnboardingWizard } from '@/features/onboarding'
import { profileDestination, profileQueryOptions } from '@/features/profile'

export const Route = createFileRoute('/_app/onboarding')({
  loader: async ({ context }) => {
    const profile =
      await context.queryClient.ensureQueryData(profileQueryOptions)
    if (profileDestination(profile) === '/dashboard') {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: OnboardingWizard,
  head: () => ({
    meta: [{ title: PAGE_TITLES.ONBOARDING }],
  }),
})
