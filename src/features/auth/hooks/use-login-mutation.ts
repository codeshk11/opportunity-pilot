import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { signInWithPassword } from '../api'
import { AUTH_MUTATION_KEY } from '../constants'
import { getAuthErrorMessage } from '../utils/auth-error-message'
import { toast } from '@/components/ui/toast'
import { profileQueryOptions } from '@/features/profile/hooks/query-options'
import { profileDestination } from '@/features/profile/utils/profile-destination'

// Logs in, then continues to onboarding or the dashboard depending on whether
// the profile is complete.
export function useLoginMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [AUTH_MUTATION_KEY.login],
    mutationFn: signInWithPassword,
    onSuccess: async () => {
      const profile = await queryClient.fetchQuery(profileQueryOptions)
      await router.navigate({ to: profileDestination(profile), replace: true })
    },
    onError: (error) => {
      toast.add({
        type: 'error',
        title: 'Could not log you in',
        description: getAuthErrorMessage(error, 'Please try again.'),
      })
    },
  })
}
