import { createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import { routeTree } from './routeTree.gen'
import { ErrorComponent } from './components/router/error-component'
import { Loading } from './components/router/loading'
import { NotFound } from './components/router/not-found'

// TanStack Start calls this once per request on the server and once in the
// browser.
export function getRouter() {
  const context = TanStackQueryProvider.getContext()

  return createRouter({
    routeTree,
    context,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: Loading,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ErrorComponent,
  })
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
