import { z } from 'zod'

const email = z.email({ error: 'Enter a valid email address.' }).max(255)

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.').max(128),
})

export const signupSchema = z.object({
  email,
  password: z
    .string()
    .min(8, 'Use at least 8 characters.')
    .max(128, 'Use at most 128 characters.'),
})

export type Credentials = z.output<typeof loginSchema>

export function getDefaultCredentials(): Credentials {
  return { email: '', password: '' }
}
