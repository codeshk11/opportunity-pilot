import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useEmailConfirmationRedirect } from './use-email-confirmation-redirect'
import type { User } from '@supabase/supabase-js'
import useAuthStore from '@/store/auth-store'

const { fetchQuery, navigate } = vi.hoisted(() => ({
  fetchQuery: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ fetchQuery }),
}))
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate }),
}))
vi.mock('@/features/profile/hooks/query-options', () => ({
  profileQueryOptions: { queryKey: ['student-profile'] },
}))

beforeEach(() => {
  useAuthStore.setState({ user: null, isReady: false })
  fetchQuery.mockResolvedValue({ completed_at: null })
  navigate.mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
  useAuthStore.setState({ user: null, isReady: false })
})

describe('email confirmation continuation', () => {
  it.each([
    [null, '/onboarding'],
    ['2026-10-24T00:00:00Z', '/dashboard'],
  ])(
    'continues after Supabase consumes the URL hash',
    async (completedAt, to) => {
      window.history.replaceState(null, '', '/#type=signup')
      fetchQuery.mockResolvedValue({ completed_at: completedAt })
      renderHook(() => useEmailConfirmationRedirect())

      // Supabase removes the callback hash before notifying SIGNED_IN.
      window.history.replaceState(null, '', '/')
      act(() => {
        useAuthStore.getState().setUser({ id: 'test-user' } as User)
      })

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith({ to, replace: true })
      })
    },
  )

  it('leaves an ordinary signed-in home visit on the home page', () => {
    window.history.replaceState(null, '', '/')
    useAuthStore.getState().setUser({ id: 'test-user' } as User)

    renderHook(() => useEmailConfirmationRedirect())

    expect(fetchQuery).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
