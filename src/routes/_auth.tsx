import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { AuthShell } from '@/features/auth'
import { profileDestination, profileQueryOptions } from '@/features/profile'
import { supabase } from '@/integrations/supabase/client'

// Login and signup. Client-only so the browser-held session is readable on
// refresh; a signed-in visit continues to onboarding or the dashboard.
export const Route = createFileRoute('/_auth')({
  ssr: false,
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) return
    const profile =
      await context.queryClient.ensureQueryData(profileQueryOptions)
    throw redirect({ to: profileDestination(profile), replace: true })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  )
}
