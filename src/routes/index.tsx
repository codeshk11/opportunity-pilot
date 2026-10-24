import { createFileRoute } from '@tanstack/react-router'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header/site-header'
import { useEmailConfirmationRedirect } from '@/features/auth'
import {
  LandingClosingCta,
  LandingHero,
  LandingHowItWorks,
} from '@/features/landing'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEmailConfirmationRedirect()

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <LandingHero />
        <LandingHowItWorks />
        <LandingClosingCta />
      </main>
      <SiteFooter />
    </div>
  )
}
