import {
  IconBellRinging,
  IconShieldCheck,
  IconTargetArrow,
} from '@tabler/icons-react'
import { m } from 'motion/react'
import type { Icon } from '@tabler/icons-react'
import type { Variants } from 'motion/react'

import type { Tone } from '@/constants/tones'
import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { EASE_OUT, riseInWithChildren } from '@/lib/motion'

const BENEFITS: Array<{
  title: string
  description: string
  icon: Icon
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

// The card rises in, then its benefits follow one by one.
const card = riseInWithChildren(0.08, 0.3)

const benefit = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
} satisfies Variants

// The pitch beside the login and signup forms, on large screens only.
export function AuthAside() {
  return (
    <BentoCard
      tone="lavender"
      interactive={false}
      variants={card}
      className="flex flex-col justify-between gap-10 max-lg:hidden md:p-10"
    >
      <div>
        <h2 className="max-w-md text-4xl leading-tight font-bold tracking-tight text-balance">
          Your next chapter starts here
        </h2>
        <p className="mt-4 max-w-md text-foreground/70">
          Tell OppPilot about yourself once. It keeps finding, checking and
          preparing the opportunities you qualify for.
        </p>
      </div>
      <ul className="grid gap-3">
        {BENEFITS.map((item) => (
          <m.li
            key={item.title}
            variants={benefit}
            className="flex items-center gap-4 rounded-2xl bg-card/80 p-4"
          >
            <BentoIcon tone={item.tone}>
              <item.icon aria-hidden />
            </BentoIcon>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </m.li>
        ))}
      </ul>
    </BentoCard>
  )
}
