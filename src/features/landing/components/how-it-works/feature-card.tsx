import type { Icon } from '@tabler/icons-react'
import type { ReactNode } from 'react'

import type { Tone } from '@/constants/tones'
import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { cn } from '@/lib/utils'

// One bento tile in "How it works": icon, title and copy, with a small
// product preview pinned to the bottom.
export function FeatureCard({
  title,
  description,
  icon: FeatureIcon,
  tone,
  isLarge = false,
  className,
  delay,
  children,
}: {
  title: string
  description: string
  icon: Icon
  tone: Tone
  isLarge?: boolean
  className?: string
  delay: number
  children: ReactNode
}) {
  return (
    <BentoCard
      tone={tone}
      delay={delay}
      className={cn('flex flex-col gap-6', className)}
    >
      <div className="flex items-start gap-4">
        <BentoIcon tone={tone}>
          <FeatureIcon aria-hidden />
        </BentoIcon>
        <div className="min-w-0">
          <h3
            className={cn(
              'font-bold tracking-tight',
              isLarge ? 'text-2xl md:text-3xl' : 'text-xl',
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              'mt-1.5 text-pretty text-foreground/70',
              isLarge && 'max-w-lg md:text-lg',
            )}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="mt-auto">{children}</div>
    </BentoCard>
  )
}
