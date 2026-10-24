import { m } from 'motion/react'
import { CtaLink } from './cta-link'
import type { Variants } from 'motion/react'

import { EASE_OUT, REVEAL_ONCE } from '@/lib/motion'
import useAuthStore from '@/store/auth-store'

const settle = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
} satisfies Variants

export function LandingClosingCta() {
  const isSignedIn = useAuthStore((state) => state.user !== null)

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_ONCE}
        variants={settle}
        className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground md:px-12 md:py-20"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 -left-10 size-56 rounded-full bg-sky/40 blur-3xl" />
          <div className="absolute -right-10 -bottom-20 size-64 rounded-full bg-peach/30 blur-3xl" />
        </div>
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-5xl">
          Deadlines don't wait. Now you don't have to chase them.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
          Tell OppPilot about yourself once. It keeps looking, checking and
          reminding. You just press submit.
        </p>
        <div className="mt-9 flex justify-center">
          <CtaLink to={isSignedIn ? '/dashboard' : '/signup'} surface="card">
            {isSignedIn ? 'Open dashboard' : 'Get started'}
          </CtaLink>
        </div>
      </m.div>
    </section>
  )
}
