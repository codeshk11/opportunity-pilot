import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { profileQueryOptions } from '@/features/profile/hooks/query-options'
import { profileDestination } from '@/features/profile/utils/profile-destination'
import useAuthStore from '@/store/auth-store'

// The email confirmation link returns to the home page with the new session in
// the URL hash. Once that session is signed in, continue into the account
// flow. Call it on the home route.
export function useEmailConfirmationRedirect() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user || !window.location.hash.includes('type=signup')) return
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
  }, [user, router, queryClient])
}
