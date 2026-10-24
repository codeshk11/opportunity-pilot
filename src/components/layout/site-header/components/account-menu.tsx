import { useState } from 'react'
import { IconLayoutDashboard, IconLogout } from '@tabler/icons-react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { signOut } from '@/lib/auth-session'

// Signed-in actions: a dashboard link and an avatar menu with sign-out.
export function AccountMenu({ email }: { email: string }) {
  const router = useRouter()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await signOut(router.options.context.queryClient)
      await navigate({ to: '/login', replace: true })
    } catch {
      toast.add({
        type: 'error',
        title: 'Could not sign out',
        description: 'Please try again.',
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="lg"
        className="max-sm:hidden"
        render={
          <Link to="/dashboard" activeProps={{ className: 'bg-muted' }} />
        }
        nativeButton={false}
      >
        <IconLayoutDashboard data-icon="inline-start" />
        Dashboard
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-full"
              aria-label="Account menu"
              disabled={isSigningOut}
            />
          }
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-lavender font-semibold text-lavender-ink uppercase">
              {email.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Signed in as
              </span>
              <span className="truncate font-medium text-foreground">
                {email}
              </span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link to="/dashboard" />}>
              <IconLayoutDashboard />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isSigningOut}
              onClick={() => void handleSignOut()}
            >
              <IconLogout />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
