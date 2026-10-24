import { createMiddleware } from '@tanstack/react-start'

import { supabase } from './client'

// Global function middleware (registered in `src/start.ts`): attaches the
// browser session's access token to every server function call so
// `requireSupabaseAuth` can verify it.
export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
)
