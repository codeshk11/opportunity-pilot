# OppPilot agent guide

## Project essentials

- TanStack Start (React 19, TypeScript, SSR) with TanStack Router, Query and
  Form; Tailwind CSS 4; shadcn/ui on Base UI; Zod 4; T3 Env; Zustand; Supabase.
- Use pnpm only (`packageManager` in [package.json](./package.json)): `pnpm` for
  scripts, `pnpm exec` for installed tools, `pnpm dlx` for one-off tools. No npm,
  no npx, no bun.
- Shadcn components use Base UI, not Radix. Compose with the `render` prop or
  `useRender`, never `asChild`. A `Button` that renders a link also takes
  `nativeButton={false}`.
- `cn` comes from `@/lib/utils` (it re-exports the `cn` package, which replaced
  clsx and tailwind-merge).
- Use semantic HTML, accessible names and keyboard navigation. Handle loading,
  empty, error and success states.

## Invariants

- Account pages live under the client-only `_app` layout and the auth pages
  under the client-only `_auth` layout; public pages stay outside them so
  refresh works with browser-held sessions.
- Student profile reads and saves use authenticated server functions
  (`src/features/profile/api`) with a shared Zod schema; the caller's user ID
  always comes from the verified middleware, never from the request body.
- Signup creates an empty profile via a database trigger; only a profile with
  `completed_at` counts as onboarded (`profileDestination`), so new accounts
  cannot skip onboarding.
- The root route owns the single identity-change subscriber, which writes the
  auth store; sign-out cancels queries and clears cached private data before
  navigating away (`src/lib/auth-session.ts`).

## Conventions

| Item | Convention | Example |
| --- | --- | --- |
| Files | kebab-case | `profile-card.tsx` |
| Components | PascalCase | `ProfileCard` |
| Functions and variables | camelCase | `profileDestination`, `isSubmitting` |
| Constants | UPPER_SNAKE | `PROFILE_QUERY_KEY` |
| Types and interfaces | PascalCase | `Profile`, `ProfileInput` |
| Hooks | camelCase, starting with `use` | `useLoginMutation` |

- Imports: React, external packages, type imports, alias imports (`@/...`),
  relative imports. Use `import type` as a separate statement. Let
  `pnpm lint:fix` order them.
- Comments: `//` comments that say how a function or component is used, above
  its definition. Keep them in sync with the code.
- Commits use [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `ui:`, `refactor:`, `chore:`, `docs:`, `style:`).

## Rules

- **Structure**: keep a feature's API calls, components, hooks, schemas,
  constants and types inside `src/features/<feature>`. A feature's `index.ts`
  exports only what its routes use, and only `src/routes` imports it; everywhere
  else import the file that defines the thing. No barrels inside a feature.
  Cross-feature constants go in `src/constants`, cross-feature state in
  `src/store`. Do not scaffold unused folders.
- **Forms**: TanStack Form with Zod schemas and `FormFields` from
  `@/components/shared/form-fields`. See [Forms](./DEVELOPMENT.md#forms). Never
  add React Hook Form.
- **Environment**: define variables in [src/env.ts](./src/env.ts) and import
  them from `@/env`. Client variables need the `VITE_` prefix; secrets never do.
  Update [.env.example](./.env.example) and
  [DEVELOPMENT.md](./DEVELOPMENT.md#environment-variables) when they change.
- **UI**: prefer existing `@/components/ui` components; add new ones with
  `pnpm dlx shadcn@latest add <name>`. Colors come from theme tokens, never a
  Tailwind palette color or hex in a class. Avoid continuously repainting
  animations (spinners, pulses, shimmer).
- **Motion**: animate with `m` components from `motion/react` and the shared
  variants in `src/lib/motion.ts`; follow [Motion](./DEVELOPMENT.md#motion).
  No em dashes in visible copy.
- **Database**: schema changes go in a new file under
  [supabase/migrations](./supabase/migrations/) with row-level security on every
  table; regenerate `src/integrations/supabase/types.ts` afterwards.
- **Dependencies**: follow the policy in
  [pnpm-workspace.yaml](./pnpm-workspace.yaml); add exact-version exceptions
  only with a reason, and never bypass the policy with flags.

## Done means

`pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` pass, and the
changed behavior was checked in the running app. Report anything unverified.

## Documentation

- [README](./README.md): purpose and quickstart.
- [Development](./DEVELOPMENT.md): setup, Supabase, commands, project layout,
  forms and UI conventions.
