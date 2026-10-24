import { createFileRoute } from '@tanstack/react-router'

import { PAGE_TITLES } from '@/constants/page-titles'
import { SignupPanel } from '@/features/auth'

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPanel,
  head: () => ({
    meta: [{ title: PAGE_TITLES.SIGNUP }],
  }),
})
