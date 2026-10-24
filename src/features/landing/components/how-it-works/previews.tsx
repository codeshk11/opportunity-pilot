import { useEffect, useRef } from 'react'
import {
  IconAlertTriangle,
  IconBellRinging,
  IconCircleCheckFilled,
  IconClockHour4,
  IconFileText,
  IconHandFinger,
  IconPencil,
} from '@tabler/icons-react'
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { DISCOVER_SAMPLES } from '../../constants'
import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'

import {
  OPPORTUNITY_TYPES,
  OPPORTUNITY_TYPE_META,
} from '@/constants/opportunity-types'
import { TONE_CLASSES } from '@/constants/tones'
import { EASE_IN_OUT, EASE_OUT, popIn } from '@/lib/motion'
import { cn } from '@/lib/utils'

// =============================================================================
// Shared frame
// =============================================================================
// Decorative mini-UIs that act out each feature once its card scrolls in. They
// are hidden from assistive tech: the card copy already says what each shows.
// Rows inherit `hidden` / `visible` from the card, which staggers them.

const row = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
} satisfies Variants

// A white panel sitting in a translucent tray, so it reads as an object on
// the pastel card rather than a flat box.
function PreviewPanel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      aria-hidden
      className="rounded-2xl bg-card/45 p-1.5 ring-1 ring-card/60"
    >
      <div
        className={cn(
          'rounded-xl bg-card p-3 text-sm shadow-sm ring-1 ring-foreground/5',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

function CheckRow({ children }: { children: ReactNode }) {
  return (
    <m.p variants={row} className="flex items-center gap-2">
      <m.span variants={popIn} className="inline-flex">
        <IconCircleCheckFilled className="size-4 shrink-0 text-mint-ink" />
      </m.span>
      {children}
    </m.p>
  )
}

// =============================================================================
// Discover
// =============================================================================

// The opportunity types the agent covers, as chips under the card copy.
export function DiscoverTypes() {
  return (
    <m.ul
      variants={row}
      aria-label="Opportunity types"
      className="flex flex-wrap gap-2 md:pl-15"
    >
      {OPPORTUNITY_TYPES.map((type) => {
        const meta = OPPORTUNITY_TYPE_META[type]
        return (
          <li
            key={type}
            className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1.5 text-sm font-medium"
          >
            <meta.icon
              className={cn('size-4', TONE_CLASSES[meta.tone].ink)}
              aria-hidden
            />
            {meta.label}
          </li>
        )
      })}
    </m.ul>
  )
}

// Listings arrive one after another, as if the agent just found them.
export function DiscoverPreview() {
  return (
    <PreviewPanel className="p-0">
      <p className="border-b px-4 py-2.5 text-xs text-muted-foreground">
        Found today across official portals, college sites and job boards
      </p>
      <ul className="divide-y">
        {DISCOVER_SAMPLES.map((sample) => {
          const meta = OPPORTUNITY_TYPE_META[sample.type]
          const tone = TONE_CLASSES[meta.tone]
          return (
            <m.li
              key={sample.title}
              variants={row}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg',
                  tone.surface,
                  tone.ink,
                )}
              >
                <meta.icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{sample.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {meta.label} · {sample.detail}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium max-sm:hidden">
                <IconClockHour4 className="size-3.5" />
                {sample.due}
              </span>
            </m.li>
          )
        })}
      </ul>
    </PreviewPanel>
  )
}

// =============================================================================
// Verify
// =============================================================================

// Checks tick off one by one, then the scam flag arrives.
export function VerifyPreview() {
  return (
    <PreviewPanel className="space-y-2">
      <CheckRow>Official source found</CheckRow>
      <CheckRow>Deadline confirmed</CheckRow>
      <m.p variants={row} className="flex items-center gap-2 text-peach-ink">
        <m.span variants={popIn} className="inline-flex">
          <IconAlertTriangle className="size-4 shrink-0" />
        </m.span>
        Asks for a “registration fee”: hidden
      </m.p>
    </PreviewPanel>
  )
}

// =============================================================================
// Match
// =============================================================================

const MATCH_SCORE = 92

// The score counts up once the card is in view, then the matched criteria
// tick in. The count runs on a motion value, so it never re-renders React.
export function MatchPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const shouldReduceMotion = useReducedMotion()
  const score = useMotionValue(0)
  const roundedScore = useTransform(score, (value) => Math.round(value))

  useEffect(() => {
    if (!isInView) return
    if (shouldReduceMotion) {
      score.set(MATCH_SCORE)
      return
    }
    const controls = animate(score, MATCH_SCORE, {
      duration: 1.2,
      ease: EASE_OUT,
      delay: 0.3,
    })
    return () => controls.stop()
  }, [isInView, shouldReduceMotion, score])

  return (
    <PreviewPanel>
      <div ref={ref} className="flex items-baseline justify-between">
        <span className="text-3xl font-bold tracking-tight text-peach-ink tabular-nums">
          <m.span>{roundedScore}</m.span>%
        </span>
        <span className="text-xs text-muted-foreground">profile match</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        {['CGPA', 'State', 'Income', 'Branch'].map((criterion) => (
          <m.span
            key={criterion}
            variants={row}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"
          >
            <IconCircleCheckFilled className="size-3 text-mint-ink" />
            {criterion}
          </m.span>
        ))}
      </div>
    </PreviewPanel>
  )
}

// =============================================================================
// Prep & Remind
// =============================================================================

export function PrepPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
      <PreviewPanel className="space-y-2">
        <CheckRow>Income certificate</CheckRow>
        <m.p variants={row} className="flex items-center gap-2">
          <IconPencil className="size-4 shrink-0 text-sky-ink" />
          Statement of purpose drafted
        </m.p>
        <m.p
          variants={row}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <IconFileText className="size-4 shrink-0" />
          Bonafide certificate still needed
        </m.p>
      </PreviewPanel>
      <m.p
        aria-hidden
        variants={row}
        className="inline-flex items-center gap-2 self-start rounded-full bg-card px-3 py-2 text-xs font-medium shadow-sm sm:self-end"
      >
        <IconBellRinging className="size-4 text-sky-ink" />
        Reminder 3 days before
      </m.p>
    </div>
  )
}

// =============================================================================
// You always press submit
// =============================================================================

// The pointer glides to the button and presses it: the final click is yours.
const pointer = {
  hidden: { opacity: 0, x: 28, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.7, ease: EASE_IN_OUT, delay: 0.2 },
  },
} satisfies Variants

const press = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 0.94, 1],
    transition: { duration: 0.35, times: [0, 0.4, 1], delay: 0.95 },
  },
} satisfies Variants

export function SubmitPreview() {
  return (
    <PreviewPanel className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="font-medium">Application ready</p>
        <p className="text-xs text-muted-foreground">
          Reviewed by you. Waiting for your click.
        </p>
      </div>
      <m.span
        variants={press}
        className="relative inline-flex shrink-0 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Submit
        <m.span
          variants={pointer}
          className="absolute -right-2 -bottom-4 inline-flex"
        >
          <IconHandFinger className="size-7 -rotate-12 fill-card text-foreground" />
        </m.span>
      </m.span>
    </PreviewPanel>
  )
}
