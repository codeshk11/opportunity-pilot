import { createFileRoute } from '@tanstack/react-router'

import { PAGE_TITLES } from '@/constants/page-titles'
import { LoginPanel } from '@/features/auth'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPanel,
  head: () => ({
    meta: [{ title: PAGE_TITLES.LOGIN }],
  }),
})
