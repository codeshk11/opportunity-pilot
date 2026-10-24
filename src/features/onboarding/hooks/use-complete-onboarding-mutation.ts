import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import { ONBOARDING_MUTATION_KEY } from '../constants'
import type { ProfileInput } from '@/features/profile/schemas/profile'
import { toast } from '@/components/ui/toast'
import { saveProfile } from '@/features/profile/api'
import { PROFILE_QUERY_KEY } from '@/features/profile/constants'

// Saves the finished profile, then welcomes the student on the dashboard.
export function useCompleteOnboardingMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const save = useServerFn(saveProfile)

  return useMutation({
    mutationKey: [ONBOARDING_MUTATION_KEY.complete],
    mutationFn: (profile: ProfileInput) => save({ data: profile }),
    onSuccess: async (_, profile) => {
      await queryClient.invalidateQueries({
        queryKey: [PROFILE_QUERY_KEY.profile],
      })
      toast.add({
        type: 'success',
        title: `Welcome aboard, ${profile.name.split(' ')[0]}`,
        description: 'Your profile is saved.',
      })
      await router.navigate({ to: '/dashboard', replace: true })
    },
    onError: (error) => {
      toast.add({
        type: 'error',
        title: 'Could not save your profile',
        description: error.message || 'Please try again.',
      })
    },
  })
}
