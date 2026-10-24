import type { Credentials } from '../schemas/credentials'
import { supabase } from '@/integrations/supabase/client'

export async function signInWithPassword(credentials: Credentials) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials)
  if (error) throw error
  return data
}

// Creates the account. The session is null while the project requires the
// student to confirm their email first; the link returns them to the home
// page.
export async function signUpWithPassword(credentials: Credentials) {
  const redirectUrl = new URL(window.location.origin)
  // Lovable Cloud accepts the loopback IP in its redirect list, not localhost.
  if (redirectUrl.hostname === 'localhost') redirectUrl.hostname = '127.0.0.1'

  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo: redirectUrl.origin },
  })
  if (error) throw error
  return data
}
