import { afterEach, describe, expect, it, vi } from 'vitest'

import { signUpWithPassword } from './index'

const { signUp } = vi.hoisted(() => ({ signUp: vi.fn() }))

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { signUp } },
}))

afterEach(() => vi.unstubAllGlobals())

describe('signup confirmation destination', () => {
  it.each([
    ['http://localhost:3000', 'http://127.0.0.1:3000'],
    ['http://127.0.0.1:3000', 'http://127.0.0.1:3000'],
    ['https://opppilot.example.com', 'https://opppilot.example.com'],
  ])('requests the allowed return URL from %s', async (origin, expected) => {
    vi.stubGlobal('window', { location: { origin } })
    signUp.mockResolvedValue({ data: { session: null }, error: null })
    const credentials = {
      email: 'student@example.com',
      password: 'synthetic-test-password',
    }

    await signUpWithPassword(credentials)

    expect(signUp).toHaveBeenCalledWith({
      ...credentials,
      options: { emailRedirectTo: expected },
    })
  })
})
