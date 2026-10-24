import { Link } from '@tanstack/react-router'

import { AccountMenu } from './components/account-menu'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/auth-store'

// A floating pill bar on every page: the logo, then sign-in links or the
// account menu once the session check finishes.
export function SiteHeader() {
  const user = useAuthStore((state) => state.user)
  const isReady = useAuthStore((state) => state.isReady)

  return (
    // The padded strip around the pill is see-through and lets clicks reach
    // the page underneath.
    <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="pointer-events-auto mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full bg-card/95 py-2 pr-2 pl-3 shadow-soft ring-1 ring-foreground/5">
        <Logo />
        {!isReady ? (
          // Holds the actions' space so the bar does not shift.
          <div className="h-10 w-40" aria-hidden />
        ) : user ? (
          <AccountMenu email={user.email ?? ''} />
        ) : (
          <nav className="flex items-center gap-1" aria-label="Account">
            <Button
              variant="ghost"
              size="lg"
              className="h-10 rounded-full px-4"
              render={<Link to="/login" />}
              nativeButton={false}
            >
              Log in
            </Button>
            <Button
              size="lg"
              className="h-10 btn-pop rounded-full px-5"
              render={<Link to="/signup" />}
              nativeButton={false}
            >
              Get started
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
