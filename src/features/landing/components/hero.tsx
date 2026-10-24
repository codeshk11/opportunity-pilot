import { Fragment } from 'react'
import { IconSparkles } from '@tabler/icons-react'
import { m } from 'motion/react'
import { CtaLink } from './cta-link'
import type { Variants } from 'motion/react'

import { Button } from '@/components/ui/button'
import { EASE_IN_OUT, EASE_OUT, blurIn } from '@/lib/motion'
import useAuthStore from '@/store/auth-store'

const HEADLINE_WORDS =
  'An AI agent that finds, checks and prepares every opportunity you qualify for,'.split(
    ' ',
  )
const DEADLINE_WORDS = ['before', 'the', 'deadline']

// The hero's one orchestrated moment: the headline arrives word by word, the
// butter highlight sweeps under "before the deadline", then the copy and
// actions settle in. Each block takes its start time through `custom`.
const block = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  }),
} satisfies Variants

const headline = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.035 } },
} satisfies Variants

const highlight = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.6, ease: EASE_IN_OUT, delay: 0.2 },
  },
} satisfies Variants

export function LandingHero() {
  const isSignedIn = useAuthStore((state) => state.user !== null)

  return (
    // Pulled up under the floating header so the color washes run behind it.
    <section className="relative isolate -mt-18 overflow-hidden pt-18">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-[8%] size-72 rounded-full bg-lavender opacity-70 blur-3xl" />
        <div className="absolute top-10 right-[6%] size-80 rounded-full bg-sky opacity-70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-64 -translate-x-1/2 rounded-full bg-peach opacity-50 blur-3xl" />
      </div>

      <m.div
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-16 pb-20 text-center sm:px-6 md:pt-24 md:pb-28"
      >
        <m.span
          variants={block}
          custom={0}
          className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm ring-1 ring-foreground/5"
        >
          <IconSparkles className="size-4 text-lavender-ink" aria-hidden />
          For Indian college students
        </m.span>

        <m.h1
          variants={headline}
          className="mt-6 text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {HEADLINE_WORDS.map((word, index) => (
            <Fragment key={index}>
              <m.span variants={blurIn} className="inline-block">
                {word}
              </m.span>{' '}
            </Fragment>
          ))}
          <span className="relative isolate inline-block whitespace-nowrap text-primary">
            {DEADLINE_WORDS.map((word, index) => (
              <Fragment key={word}>
                <m.span variants={blurIn} className="inline-block">
                  {word}
                </m.span>
                {index < DEADLINE_WORDS.length - 1 ? ' ' : null}
              </Fragment>
            ))}
            <m.span
              aria-hidden
              variants={highlight}
              className="absolute inset-x-0 bottom-1 -z-10 h-1/3 rounded-sm bg-butter"
            />
          </span>
        </m.h1>

        <m.p
          variants={block}
          custom={0.55}
          className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl"
        >
          Scholarships, internships, hackathons and government schemes.
          Verified, matched to your profile and ready to apply.
        </m.p>

        <m.div
          variants={block}
          custom={0.65}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <CtaLink to={isSignedIn ? '/dashboard' : '/signup'}>
            {isSignedIn ? 'Open dashboard' : 'Get started'}
          </CtaLink>
          <Button
            variant="ghost"
            size="lg"
            className="h-12 rounded-full px-5 text-base"
            render={<a href="#how-it-works" />}
            nativeButton={false}
          >
            See how it works
          </Button>
        </m.div>
      </m.div>
    </section>
  )
}
