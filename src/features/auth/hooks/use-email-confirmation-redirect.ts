import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { profileQueryOptions } from '@/features/profile/hooks/query-options'
import { profileDestination } from '@/features/profile/utils/profile-destination'
import useAuthStore from '@/store/auth-store'

// The email confirmation link returns to the home page with the new session in
// the URL hash. Once that session is signed in, continue into the account
// flow. Call it on the home route.
export function useEmailConfirmationRedirect() {
  // Capture the callback intent before the root's session check lets Supabase
  // consume the hash. By the time SIGNED_IN arrives the hash is already gone.
  const [isSignupConfirmation] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.hash.slice(1)).get('type') ===
        'signup',
  )
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user || !isSignupConfirmation) return
    let isActive = true
    queryClient
      .fetchQuery(profileQueryOptions)
      .then((profile) => {
        if (!isActive) return
        void router.navigate({ to: profileDestination(profile), replace: true })
      })
      .catch(() => {
        // Stay on the home page; the header still offers the dashboard.
      })
    return () => {
      isActive = false
    }
  }, [isSignupConfirmation, user, router, queryClient])
}
