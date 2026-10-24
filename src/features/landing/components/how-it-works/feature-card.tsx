import type { Icon } from '@tabler/icons-react'
import type { ReactNode } from 'react'

import type { Tone } from '@/constants/tones'
import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { riseInWithChildren } from '@/lib/motion'
import { cn } from '@/lib/utils'

// The card rises in, then its preview plays: rows inside follow 250ms later,
// 120ms apart.
const card = riseInWithChildren(0.12, 0.25)

// One bento tile in "How it works": icon, title and copy, with a preview
// that shows the feature at work pinned to the bottom. The grid drives its
// `hidden` / `visible` state.
export function FeatureCard({
  title,
  description,
  icon: FeatureIcon,
  tone,
  isLarge = false,
  tags,
  className,
  children,
}: {
  title: string
  description: string
  icon: Icon
  tone: Tone
  isLarge?: boolean
  // Shown right under the copy, before the pinned preview.
  tags?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <BentoCard
      tone={tone}
      variants={card}
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
      {tags}
      <div className="mt-auto">{children}</div>
    </BentoCard>
  )
}
