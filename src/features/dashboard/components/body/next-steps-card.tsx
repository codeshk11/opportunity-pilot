import {
  IconBellRinging,
  IconShieldCheck,
  IconTargetArrow,
  IconWorldSearch,
} from '@tabler/icons-react'

import { BentoCard } from '@/components/shared/bento-card'
import { cn } from '@/lib/utils'

const AGENT_STEPS = [
  {
    title: 'Discover',
    icon: IconWorldSearch,
    text: 'Scan listings across India',
  },
  {
    title: 'Verify',
    icon: IconShieldCheck,
    text: 'Check each official source',
  },
  {
    title: 'Match',
    icon: IconTargetArrow,
    text: 'Rank them against your profile',
  },
  {
    title: 'Remind',
    icon: IconBellRinging,
    text: 'Prep documents, nudge before deadlines',
  },
] as const

// What the agent will do once "Find opportunities" goes live.
export function NextStepsCard({ className }: { className?: string }) {
  return (
    <BentoCard
      tone="sky"
      delay={320}
      className={cn('flex flex-col gap-5', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold tracking-tight">What happens next</h2>
        <p className="text-sm text-foreground/60">
          You review everything and press submit yourself.
        </p>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AGENT_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex items-start gap-3 rounded-xl bg-card/80 p-4"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky text-sky-ink">
              <step.icon aria-hidden className="size-4.5" />
            </span>
            <div>
              <p className="font-semibold">
                <span className="text-foreground/50">{index + 1}. </span>
                {step.title}
              </p>
              <p className="text-sm text-foreground/70">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </BentoCard>
  )
}
