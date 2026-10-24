import { createFileRoute, redirect } from '@tanstack/react-router'

import { PAGE_TITLES } from '@/constants/page-titles'
import { DashboardBody } from '@/features/dashboard'
import { profileDestination, profileQueryOptions } from '@/features/profile'

export const Route = createFileRoute('/_app/dashboard')({
  loader: async ({ context }) => {
    const profile =
      await context.queryClient.ensureQueryData(profileQueryOptions)
    if (profileDestination(profile) === '/onboarding') {
      throw redirect({ to: '/onboarding', replace: true })
    }
  },
  component: DashboardBody,
  head: () => ({
    meta: [{ title: PAGE_TITLES.DASHBOARD }],
  }),
})
