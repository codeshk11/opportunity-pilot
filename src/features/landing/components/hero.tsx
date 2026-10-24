import { IconArrowRight, IconSparkles } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  OPPORTUNITY_TYPES,
  OPPORTUNITY_TYPE_META,
} from '@/constants/opportunity-types'
import { TONE_CLASSES } from '@/constants/tones'
import { cn } from '@/lib/utils'
import useAuthStore from '@/store/auth-store'

export function LandingHero() {
  const isSignedIn = useAuthStore((state) => state.user !== null)

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-[8%] size-72 rounded-full bg-lavender opacity-70 blur-3xl" />
        <div className="absolute top-10 right-[6%] size-80 rounded-full bg-sky opacity-70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-64 -translate-x-1/2 rounded-full bg-peach opacity-50 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-14 pb-16 text-center sm:px-6 md:pt-24 md:pb-24">
        <span className="inline-flex fade-up items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm">
          <IconSparkles className="size-4 text-lavender-ink" aria-hidden />
          For Indian college students
        </span>

        <h1
          className="isolate mt-6 fade-up text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl md:text-6xl"
          style={{ animationDelay: '80ms' }}
        >
          An AI agent that finds, checks and prepares every opportunity you
          qualify for,{' '}
          <span className="relative whitespace-nowrap text-primary">
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 -z-10 h-1/3 rounded-sm bg-butter"
            />
            before the deadline
          </span>
        </h1>

        <p
          className="mt-6 max-w-2xl fade-up text-lg text-pretty text-muted-foreground md:text-xl"
          style={{ animationDelay: '160ms' }}
        >
          Scholarships, internships, hackathons and government schemes.
          Verified, matched to your profile and ready to apply.
        </p>

        <div
          className="mt-9 flex fade-up flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: '240ms' }}
        >
          <Button
            size="lg"
            className="h-12 btn-pop rounded-full px-7 text-base font-semibold"
            render={<Link to={isSignedIn ? '/dashboard' : '/signup'} />}
            nativeButton={false}
          >
            {isSignedIn ? 'Open your dashboard' : 'Get started'}
            <IconArrowRight data-icon="inline-end" className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-12 rounded-full px-5 text-base"
            render={<a href="#how-it-works" />}
            nativeButton={false}
          >
            See how it works
          </Button>
        </div>

        <ul
          aria-label="Opportunity types"
          className="mt-10 flex fade-up flex-wrap justify-center gap-2"
          style={{ animationDelay: '320ms' }}
        >
          {OPPORTUNITY_TYPES.map((type) => {
            const meta = OPPORTUNITY_TYPE_META[type]
            const tone = TONE_CLASSES[meta.tone]
            return (
              <li
                key={type}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
                  tone.surface,
                )}
              >
                <meta.icon className={cn('size-4', tone.ink)} aria-hidden />
                {meta.label}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
