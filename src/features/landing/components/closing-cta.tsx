import { IconArrowRight } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/auth-store'

export function LandingClosingCta() {
  const isSignedIn = useAuthStore((state) => state.user !== null)

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-12 md:py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 -left-10 size-56 rounded-full bg-sky/40 blur-3xl" />
          <div className="absolute -right-10 -bottom-20 size-64 rounded-full bg-peach/30 blur-3xl" />
        </div>
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Deadlines don't wait. Now you don't have to chase them.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Tell OppPilot about yourself once. It keeps looking, checking and
          reminding. You just press submit.
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="mt-8 h-12 btn-pop rounded-full bg-card px-7 text-base font-semibold text-foreground hover:bg-card"
          render={<Link to={isSignedIn ? '/dashboard' : '/signup'} />}
          nativeButton={false}
        >
          {isSignedIn ? 'Open your dashboard' : 'Create your profile'}
          <IconArrowRight data-icon="inline-end" className="size-5" />
        </Button>
      </div>
    </section>
  )
}
