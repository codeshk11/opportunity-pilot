import { createClient } from '@supabase/supabase-js'

import { createSupabaseFetch } from './shared'
import type { Database } from './types'
import { env } from '@/env'

function createSupabaseAdminClient() {
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to the server environment.',
    )
  }

  return createClient<Database>(env.VITE_SUPABASE_URL, serviceRoleKey, {
    global: { fetch: createSupabaseFetch(serviceRoleKey) },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

let adminClient: ReturnType<typeof createSupabaseAdminClient> | undefined

// Service-role Supabase client: bypasses row-level security. Use it only for
// trusted admin work in server functions; queries made for a signed-in user go
// through `requireSupabaseAuth` instead. Load it inside a server handler:
//   const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
export const supabaseAdmin = new Proxy(
  {} as ReturnType<typeof createSupabaseAdminClient>,
  {
    get(_, prop, receiver) {
      adminClient ??= createSupabaseAdminClient()
      return Reflect.get(adminClient, prop, receiver)
    },
  },
)
