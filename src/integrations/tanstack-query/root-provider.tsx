import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// One QueryClient per router instance: per request during SSR, once in the
// browser. `src/router.tsx` puts it on the router context.
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 1 },
    },
  })

  return { queryClient }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
