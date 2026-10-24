import { IconArrowUpRight } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// The landing page's primary call to action: a pill whose arrow sits in its
// own circle and nudges toward the destination on hover.
export function CtaLink({
  to,
  surface = 'primary',
  children,
}: {
  to: LinkProps['to']
  // `card` for use on a purple background.
  surface?: 'primary' | 'card'
  children: ReactNode
}) {
  return (
    <Button
      size="lg"
      className={cn(
        'group/cta h-12 btn-pop gap-3 rounded-full pr-1.5 pl-6 text-base font-semibold',
        surface === 'card' && 'bg-card text-foreground hover:bg-card',
      )}
      render={<Link to={to} />}
      nativeButton={false}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          'grid size-9 place-items-center rounded-full transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5',
          surface === 'card'
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary-foreground/20',
        )}
      >
        <IconArrowUpRight className="size-4.5" />
      </span>
    </Button>
  )
}
