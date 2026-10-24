import { createClient } from '@supabase/supabase-js'
import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { createSupabaseFetch } from './shared'
import type { Database } from './types'
import { env } from '@/env'

// Server function middleware: verifies the caller's bearer token and hands the
// handler a Supabase client acting as that user (so RLS applies) plus the
// verified user ID. The browser side attaches the token in `auth-attacher.ts`.
export const requireSupabaseAuth = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const authHeader = getRequest().headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : ''
  if (token.split('.').length !== 3) {
    throw new Error('Unauthorized: a valid bearer token is required')
  }

  const supabase = createClient<Database>(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: createSupabaseFetch(env.VITE_SUPABASE_PUBLISHABLE_KEY),
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )

  const { data, error } = await supabase.auth.getClaims(token)
  const userId = data?.claims.sub
  if (error || !userId) throw new Error('Unauthorized: invalid token')

  return next({ context: { supabase, userId } })
})
