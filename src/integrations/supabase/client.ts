import { createClient } from '@supabase/supabase-js'

import { createSupabaseFetch } from './shared'
import type { Database } from './types'
import { env } from '@/env'

function createSupabaseClient() {
  return createClient<Database>(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      global: { fetch: createSupabaseFetch(env.VITE_SUPABASE_PUBLISHABLE_KEY) },
      auth: { persistSession: true, autoRefreshToken: true },
    },
  )
}

let client: ReturnType<typeof createSupabaseClient> | undefined

// Browser Supabase client; row-level security applies. Created on first use so
// importing it during SSR costs nothing.
export const supabase = new Proxy(
  {} as ReturnType<typeof createSupabaseClient>,
  {
    get(_, prop, receiver) {
      client ??= createSupabaseClient()
      return Reflect.get(client, prop, receiver)
    },
  },
)
