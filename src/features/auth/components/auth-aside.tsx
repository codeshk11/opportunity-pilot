import {
  IconBellRinging,
  IconShieldCheck,
  IconTargetArrow,
} from '@tabler/icons-react'

import type { Tone } from '@/constants/tones'
import { BentoCard, BentoIcon } from '@/components/shared/bento-card'

const BENEFITS: Array<{
  title: string
  description: string
  icon: typeof IconTargetArrow
  tone: Tone
}> = [
  {
    title: 'Matched to you',
    description: 'Ranked by your course, state, income and skills.',
    icon: IconTargetArrow,
    tone: 'peach',
  },
  {
    title: 'Checked at the source',
    description: 'Every listing traced to an official page.',
    icon: IconShieldCheck,
    tone: 'mint',
  },
  {
    title: 'Never miss a deadline',
    description: 'Documents listed and reminders set for you.',
    icon: IconBellRinging,
    tone: 'sky',
  },
]

// The pitch beside the login and signup forms, on large screens only.
export function AuthAside() {
  return (
    <BentoCard
      tone="lavender"
      interactive={false}
      className="flex flex-col justify-between gap-10 max-lg:hidden md:p-10"
    >
      <div>
        <p className="text-sm font-semibold text-lavender-ink">
          For Indian college students
        </p>
        <h2 className="mt-3 max-w-md text-4xl leading-tight font-bold tracking-tight text-balance">
          Your next chapter starts here
        </h2>
        <p className="mt-4 max-w-md text-foreground/70">
          Tell OppPilot about yourself once. It keeps finding, checking and
          preparing the opportunities you qualify for.
        </p>
      </div>
      <ul className="grid gap-3">
        {BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="flex items-center gap-4 rounded-2xl bg-card/80 p-4"
          >
            <BentoIcon tone={benefit.tone}>
              <benefit.icon aria-hidden />
            </BentoIcon>
            <div>
              <p className="font-semibold">{benefit.title}</p>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </BentoCard>
  )
}
