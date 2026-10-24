import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { AuthAside } from './auth-aside'
import type { ReactNode } from 'react'

import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'

// Layout for the login and signup pages: a short header, the OppPilot pitch
// on large screens, and the page's panel.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <Button
          variant="ghost"
          size="lg"
          render={<Link to="/" />}
          nativeButton={false}
        >
          <IconArrowLeft data-icon="inline-start" />
          Home
        </Button>
      </header>
      <main className="mx-auto grid max-w-6xl gap-5 px-4 pt-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-6 lg:pt-10">
        <AuthAside />
        <div className="min-w-0">{children}</div>
      </main>
    </div>
  )
}
