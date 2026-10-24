//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import { plugin as shadcn } from '@shadcn/lint'

export default [
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      '.output/**',
      '.nitro/**',
      '.tanstack/**',
      'src/routeTree.gen.ts',
      'src/integrations/supabase/types.ts',
    ],
  },
  ...tanstackConfig,
  // @shadcn/lint: design-system rules for the app source. It finds the UI
  // components (@/components/ui) and the theme (src/styles/styles.css) through
  // components.json. Arbitrary layout values (sizes, grid templates) pass; the
  // `cn-*` classes are the shadcn registry's style hooks.
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { shadcn },
    rules: {
      'shadcn/no-arbitrary-values': ['error', { allow: ['layout'] }],
      'shadcn/no-raw-colors': 'error',
      'shadcn/no-unknown-classes': ['error', { allow: ['cn-*'] }],
    },
  },
  // Component directories own their appearance and may need structural values
  // such as ring-[3px], so they skip the arbitrary-value rule.
  {
    files: ['src/components/ui/**'],
    rules: {
      'shadcn/no-arbitrary-values': 'off',
    },
  },
]
