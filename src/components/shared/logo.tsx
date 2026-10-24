import { IconNavigationFilled } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

// The OppPilot wordmark, linking home.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        'group/logo inline-flex items-center gap-2.5 rounded-lg text-lg font-bold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover/logo:-rotate-6 motion-reduce:transition-none">
        <IconNavigationFilled className="size-4.5 rotate-45" aria-hidden />
      </span>
      OppPilot
    </Link>
  )
}
