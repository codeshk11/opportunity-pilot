import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { SiteHeader } from '@/components/layout/site-header/site-header'
import { supabase } from '@/integrations/supabase/client'

// Account pages. Client-only so the browser-held session is readable on
// refresh; signed-out visits go to the login page.
export const Route = createFileRoute('/_app')({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) throw redirect({ to: '/login' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
