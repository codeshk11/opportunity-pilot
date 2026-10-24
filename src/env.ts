import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

// Validated environment. Import values from `@/env`; never read
// `import.meta.env` or `process.env` for these directly.
export const env = createEnv({
  server: {
    // Bypasses row-level security. Read only in trusted server code.
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    // Server-only TinyFish key. Never use the VITE_ prefix.
    TINYFISH_API_KEY: z.string().min(1).optional(),
  },

  // The prefix that client-side variables must have. Enforced both at a
  // type level and at runtime.
  clientPrefix: 'VITE_',

  client: {
    VITE_SUPABASE_URL: z.url(),
    VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },

  // Vite inlines VITE_* into both the browser and the SSR bundle; server-only
  // secrets come from the process environment at runtime.
  runtimeEnv: {
    ...import.meta.env,
    SUPABASE_SERVICE_ROLE_KEY:
      typeof process === 'undefined'
        ? undefined
        : process.env['SUPABASE_SERVICE_ROLE_KEY'],
    TINYFISH_API_KEY:
      typeof process === 'undefined' ? undefined : process.env['TINYFISH_API_KEY'],
  },

  isServer: typeof window === 'undefined',

  // Treat `KEY=` in a .env file as unset so defaults and optionals apply.
  emptyStringAsUndefined: true,
})
