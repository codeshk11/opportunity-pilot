import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  server: { host: '127.0.0.1' },
  plugins: [
    devtools(),
    tanstackStart({
      // src/server.ts wraps the SSR handler with a friendly error page.
      server: { entry: 'server' },
      importProtection: {
        behavior: 'error',
        client: { files: ['**/server/**'], specifiers: ['server-only'] },
      },
    }),
    // Nitro builds the deployable server: Node locally, and the host's own
    // target (Vercel, Netlify, Cloudflare...) when built in their CI.
    command === 'build' && nitro(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
