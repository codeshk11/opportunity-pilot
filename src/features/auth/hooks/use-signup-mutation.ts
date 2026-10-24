import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { signUpWithPassword } from '../api'
import { AUTH_MUTATION_KEY } from '../constants'
import { getAuthErrorMessage } from '../utils/auth-error-message'
import { toast } from '@/components/ui/toast'

// Creates the account. With a session the student goes straight to
// onboarding; without one, `data.session` is null and the caller shows the
// check-your-inbox state.
export function useSignupMutation() {
  const router = useRouter()

  return useMutation({
    mutationKey: [AUTH_MUTATION_KEY.signup],
    mutationFn: signUpWithPassword,
    onSuccess: async ({ session }) => {
      if (!session) return
      await router.navigate({ to: '/onboarding', replace: true })
    },
    onError: (error) => {
      toast.add({
        type: 'error',
        title: 'Could not create your account',
        description: getAuthErrorMessage(error, 'Please try again.'),
      })
    },
  })
}
