import { m } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'

import type { Tone } from '@/constants/tones'
import { TONE_CLASSES } from '@/constants/tones'
import { cn } from '@/lib/utils'

interface BentoCardProps extends HTMLMotionProps<'div'> {
  tone?: Tone | 'card'
  // Lift on hover. Keep it for cards that read as tiles; turn it off for cards
  // that hold a form.
  interactive?: boolean
}

// A tile in a bento grid: a rounded-2xl pastel surface with a soft shadow.
// It is a Motion element, so pass `variants` and let a parent drive
// `hidden` / `visible`. Size it with grid span classes from the parent.
export function BentoCard({
  tone = 'card',
  interactive = true,
  className,
  ...props
}: BentoCardProps) {
  return (
    <m.div
      data-slot="bento-card"
      className={cn(
        'rounded-2xl p-6 md:p-7',
        interactive ? 'card-soft' : 'shadow-soft',
        tone === 'card' ? 'bg-card' : TONE_CLASSES[tone].surface,
        className,
      )}
      {...props}
    />
  )
}

// The rounded white icon tile at the top of a bento card.
export function BentoIcon({
  tone,
  className,
  children,
}: {
  tone: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-2xl bg-card shadow-sm [&_svg:not([class*=size-])]:size-6',
        TONE_CLASSES[tone].ink,
        className,
      )}
    >
      {children}
    </span>
  )
}
