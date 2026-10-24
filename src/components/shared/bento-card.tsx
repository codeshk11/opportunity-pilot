import type { CSSProperties, ComponentProps } from 'react'

import type { Tone } from '@/constants/tones'
import { TONE_CLASSES } from '@/constants/tones'
import { cn } from '@/lib/utils'

interface BentoCardProps extends ComponentProps<'div'> {
  tone?: Tone | 'card'
  // Lift on hover. Keep it for cards that read as tiles; turn it off for cards
  // that hold a form.
  interactive?: boolean
  // Entrance delay in milliseconds for staggered fade-ups.
  delay?: number
}

// A tile in a bento grid: rounded-2xl pastel surface with a soft shadow that
// fades up on load. Size it with grid span classes from the parent layout.
export function BentoCard({
  tone = 'card',
  interactive = true,
  delay,
  className,
  style,
  ...props
}: BentoCardProps) {
  const animationStyle: CSSProperties | undefined =
    delay === undefined ? style : { ...style, animationDelay: `${delay}ms` }

  return (
    <div
      data-slot="bento-card"
      className={cn(
        'fade-up rounded-2xl p-6 md:p-7',
        interactive ? 'card-soft' : 'shadow-soft',
        tone === 'card' ? 'bg-card' : TONE_CLASSES[tone].surface,
        className,
      )}
      style={animationStyle}
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
