import type { Credentials } from '../schemas/credentials'
import { supabase } from '@/integrations/supabase/client'

export async function signInWithPassword(credentials: Credentials) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials)
  if (error) throw error
  return data
}

// Send new accounts to a dedicated callback so the app can show a real
// verified state after Supabase has accepted the email confirmation.
export async function signUpWithPassword(credentials: Credentials) {
  const redirectUrl = new URL('/auth/callback', window.location.origin)
  // Lovable Cloud accepts the loopback IP in its redirect list, not localhost.
  if (redirectUrl.hostname === 'localhost') redirectUrl.hostname = '127.0.0.1'

  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo: redirectUrl.toString() },
  })
  if (error) throw error
  return data
}
