import { useEffect } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import * as TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles/styles.css?url'
import type { ReactNode } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { MotionProvider } from '@/components/shared/motion-provider'
import { Toaster } from '@/components/ui/toast'
import { PAGE_TITLES } from '@/constants/page-titles'
import { supabase } from '@/integrations/supabase/client'
import useAuthStore from '@/store/auth-store'

interface MyRouterContext {
  queryClient: QueryClient
}

const DESCRIPTION =
  'OppPilot finds, verifies and prepares every scholarship, internship, hackathon and government scheme Indian students qualify for.'

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#fbf8f3' },
      { title: PAGE_TITLES.HOME },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: 'OppPilot' },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
})

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  useIdentitySync(queryClient)

  return (
    <TanStackQueryProvider.Provider queryClient={queryClient}>
      <MotionProvider>
        <Toaster>
          <Outlet />
        </Toaster>
      </MotionProvider>
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </TanStackQueryProvider.Provider>
  )
}

// The app's single identity-change subscriber: keeps the auth store, the
// query cache and route loaders in step with whoever is signed in.
function useIdentitySync(queryClient: QueryClient) {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    let isActive = true
    let hasIdentityChanged = false
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== 'SIGNED_IN' &&
        event !== 'SIGNED_OUT' &&
        event !== 'USER_UPDATED'
      ) {
        return
      }
      hasIdentityChanged = true
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') queryClient.clear()
      else void queryClient.invalidateQueries()
      void router.invalidate()
    })
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (isActive && !hasIdentityChanged) setUser(data.user)
      })
      .catch(() => {
        if (isActive && !hasIdentityChanged) setUser(null)
      })
    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [router, queryClient, setUser])
}
