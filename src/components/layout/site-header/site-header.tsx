import { Link } from '@tanstack/react-router'

import { AccountMenu } from './components/account-menu'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/auth-store'

// Sticky top bar on every page: the logo, then sign-in links or the account
// menu once the session check finishes.
export function SiteHeader() {
  const user = useAuthStore((state) => state.user)
  const isReady = useAuthStore((state) => state.isReady)

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        {!isReady ? (
          // Holds the actions' space so the bar does not shift.
          <div className="h-9 w-40" aria-hidden />
        ) : user ? (
          <AccountMenu email={user.email ?? ''} />
        ) : (
          <nav
            className="flex items-center gap-1 sm:gap-2"
            aria-label="Account"
          >
            <Button
              variant="ghost"
              size="lg"
              render={<Link to="/login" />}
              nativeButton={false}
            >
              Log in
            </Button>
            <Button
              size="lg"
              className="btn-pop rounded-full px-4"
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
