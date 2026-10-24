import type { ReactNode } from 'react'

import { Logo } from '@/components/shared/logo'

// Full-page message card shared by the not-found and error views.
export function StatusView({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-16">
      <Logo />
      <div className="w-full max-w-md fade-up rounded-2xl bg-lavender p-8 text-center shadow-soft">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-card text-lavender-ink shadow-sm [&_svg]:size-7">
          {icon}
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 mb-6 text-muted-foreground">{description}</p>
        {children}
      </div>
    </main>
  )
}
