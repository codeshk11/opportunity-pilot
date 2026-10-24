import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { m } from 'motion/react'
import { AuthAside } from './auth-aside'
import type { ReactNode } from 'react'

import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { stagger } from '@/lib/motion'

const layout = stagger(0.1)

// Layout for the login and signup pages: a short header, the OppPilot pitch
// on large screens, and the page's panel. The pitch and panel rise in once,
// when the layout first mounts.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <Button
          variant="ghost"
          size="lg"
          className="h-10 rounded-full px-4"
          render={<Link to="/" />}
          nativeButton={false}
        >
          <IconArrowLeft data-icon="inline-start" />
          Home
        </Button>
      </header>
      <m.main
        initial="hidden"
        animate="visible"
        variants={layout}
        className="mx-auto grid max-w-6xl gap-5 px-4 pt-2 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-6 lg:pt-8"
      >
        <AuthAside />
        <div className="min-w-0">{children}</div>
      </m.main>
    </div>
  )
}
