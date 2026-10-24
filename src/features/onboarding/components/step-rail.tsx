import { IconCircleCheckFilled } from '@tabler/icons-react'
import { AnimatePresence, m } from 'motion/react'

import { ONBOARDING_STEPS } from '../constants'
import { BentoIcon } from '@/components/shared/bento-card'
import { TONE_CLASSES } from '@/constants/tones'
import { popIn, riseIn, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

const rail = stagger(0.06)

// The three steps as pastel tiles: a row on small screens, a column beside
// the form from lg. The purple ring glides to the current step, and a tick
// pops in on each finished one. Needs the layout features (see
// `loadLayoutFeatures`) for the gliding ring.
export function StepRail({ currentIndex }: { currentIndex: number }) {
  return (
    <m.ol
      variants={rail}
      className="grid grid-cols-3 gap-2 self-start sm:gap-3 lg:grid-cols-1 lg:gap-4"
    >
      {ONBOARDING_STEPS.map((step, index) => {
        const isCurrent = index === currentIndex
        const isDone = index < currentIndex
        return (
          <m.li
            key={step.title}
            variants={riseIn}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'relative flex flex-col gap-3 rounded-2xl p-3 shadow-soft transition-opacity duration-300 sm:p-4 lg:flex-row lg:items-center lg:p-5',
              TONE_CLASSES[step.tone].surface,
              !isCurrent && !isDone && 'opacity-70',
            )}
          >
            {isCurrent ? (
              <m.span
                layoutId="onboarding-current-step"
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-primary"
                transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
              />
            ) : null}
            <BentoIcon tone={step.tone} className="size-9 lg:size-11">
              <step.icon aria-hidden className="size-5 lg:size-6" />
            </BentoIcon>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground/60">
                Step {index + 1}
                {isDone ? <span className="sr-only">, done</span> : null}
              </p>
              <p className="text-sm font-semibold sm:text-base">{step.title}</p>
              <p className="text-sm text-foreground/60 max-lg:hidden">
                {step.description}
              </p>
            </div>
            <AnimatePresence initial={false}>
              {isDone ? (
                <m.span
                  key="done"
                  aria-hidden
                  variants={popIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="inline-flex shrink-0 max-lg:hidden lg:ml-auto"
                >
                  <IconCircleCheckFilled className="size-5 text-mint-ink" />
                </m.span>
              ) : null}
            </AnimatePresence>
          </m.li>
        )
      })}
    </m.ol>
  )
}
