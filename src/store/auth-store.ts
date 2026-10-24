import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  // The signed-in Supabase user, or null when signed out.
  user: User | null
  // False until the first session check finishes; render auth-aware UI after.
  isReady: boolean
  setUser: (user: User | null) => void
}

// Who is signed in, for UI. The root route's identity subscriber is the only
// writer; route guards verify with `supabase.auth.getUser()` instead.
const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isReady: false,
  setUser: (user) => {
    set({ user, isReady: true })
  },
}))

export default useAuthStore
