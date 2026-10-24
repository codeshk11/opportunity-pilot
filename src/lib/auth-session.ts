import type { QueryClient } from '@tanstack/react-query'

import { supabase } from '@/integrations/supabase/client'

// Signs out after dropping every cached query, so no private data from this
// account survives into the next one. Throws when Supabase rejects the
// sign-out; callers then navigate to the login page.
export async function signOut(queryClient: QueryClient) {
  await queryClient.cancelQueries()
  queryClient.clear()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
