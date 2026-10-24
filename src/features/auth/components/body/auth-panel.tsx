import type { ReactNode } from 'react'

import { BentoCard } from '@/components/shared/bento-card'

// The white card that holds a login or signup form.
export function AuthPanel({
  title,
  description,
  footer,
  children,
}: {
  title: string
  description: string
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <BentoCard
      interactive={false}
      delay={80}
      className="flex flex-col gap-7 md:p-9"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      {children}
      {footer ? (
        <p className="border-t pt-5 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      ) : null}
    </BentoCard>
  )
}
