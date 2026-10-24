import { IconCircleCheckFilled } from '@tabler/icons-react'

import { ONBOARDING_STEPS } from '../constants'
import { BentoIcon } from '@/components/shared/bento-card'
import { TONE_CLASSES } from '@/constants/tones'
import { cn } from '@/lib/utils'

// The three steps as pastel tiles: a row on small screens, a column beside
// the form from lg.
export function StepRail({ currentIndex }: { currentIndex: number }) {
  return (
    <ol className="grid grid-cols-3 gap-2 self-start sm:gap-3 lg:grid-cols-1 lg:gap-4">
      {ONBOARDING_STEPS.map((step, index) => {
        const isCurrent = index === currentIndex
        const isDone = index < currentIndex
        return (
          <li
            key={step.title}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'flex fade-up flex-col gap-3 rounded-2xl p-3 shadow-soft transition-shadow duration-200 sm:p-4 lg:flex-row lg:items-center lg:p-5',
              TONE_CLASSES[step.tone].surface,
              isCurrent && 'ring-2 ring-primary',
              !isCurrent && !isDone && 'opacity-70',
            )}
            style={{ animationDelay: `${80 + index * 60}ms` }}
          >
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
            {isDone ? (
              <IconCircleCheckFilled
                aria-hidden
                className="size-5 shrink-0 text-mint-ink max-lg:hidden lg:ml-auto"
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
