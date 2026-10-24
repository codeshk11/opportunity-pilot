# Development

## Setup

- Node.js 24 (`.nvmrc` pins 24.19.0) and pnpm 12.11.2 (`packageManager` in
  [package.json](./package.json)). Use pnpm only: `pnpm` for scripts,
  `pnpm exec` for installed tools and `pnpm dlx` for one-off tools.
- [pnpm-workspace.yaml](./pnpm-workspace.yaml) holds the supply-chain policy:
  package versions must be 7 days old, trust evidence may not downgrade, and
  each lifecycle-script permission is listed with its reason.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Environment variables

Defined and validated in [src/env.ts](./src/env.ts) with T3 Env and Zod. Import
values from `@/env`; do not read `import.meta.env` or `process.env` for them
directly.

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser and server | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser and server | Publishable (anon) key; row-level security protects the data |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only, optional | Bypasses row-level security; only for trusted admin work |

Vite inlines `VITE_*` values into both bundles at build time. Server-only values
are read from the process environment when the server runs.

## Supabase

The schema lives in
[supabase/migrations](./supabase/migrations/). To run against your own project:

1. Create a project at <https://supabase.com> and copy its URL and publishable
   key into `.env`.
2. Apply the migrations with the Supabase CLI:

   ```bash
   pnpm dlx supabase link --project-ref <your-project-ref>
   pnpm dlx supabase db push
   ```

   Or paste the migration SQL into the project's SQL editor.
3. In Authentication > URL Configuration, set the Site URL and add your local
   and deployed origins (for example `http://localhost:3000`) to the redirect
   URLs. Email confirmation links return to the home page.
4. After a schema change, regenerate the types:

   ```bash
   pnpm dlx supabase gen types typescript --project-id <your-project-ref> > src/integrations/supabase/types.ts
   ```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on <http://localhost:3000> |
| `pnpm build` | Production build (Nitro server in `.output/`), then a typecheck |
| `pnpm start` | Runs the built server |
| `pnpm preview` | Builds, then serves the build on port 4173 |
| `pnpm lint` / `pnpm lint:fix` | ESLint (TanStack config, import order, shadcn design rules) |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm format:check` / `pnpm format:write` | Prettier with the Tailwind class sorter |
| `pnpm test` / `pnpm test:watch` | Vitest |

Nitro picks the deploy target from the environment: Node when built locally,
and the host's own target (Vercel, Netlify, Cloudflare and others) when built in
their CI.

## Project structure

```text
src/
  components/
    ui/                 # shadcn components on Base UI
    layout/             # Site header and footer
    router/             # Loading, error and not-found views
    shared/             # Logo, bento card, shared form fields
  constants/            # Cross-feature constants (page titles, tones, opportunity types)
  features/             # Self-contained feature modules
  integrations/         # Supabase clients and middleware, TanStack Query provider
  lib/                  # Shared utilities (cn, sign-out, SSR error helpers)
  routes/               # TanStack Router file routes
  store/                # Cross-feature Zustand stores
  styles/               # Global styles, theme tokens and utilities
  test/                 # Shared test setup
  env.ts                # Environment validation
  router.tsx            # Router factory used by TanStack Start
  start.ts, server.ts   # TanStack Start middleware and server entry
supabase/migrations/    # Database schema
```

### Routes

| Path | Route file | Notes |
| --- | --- | --- |
| `/` | `routes/index.tsx` | Landing page, server-rendered |
| `/signup`, `/login` | `routes/_auth/*` | Client-only; signed-in visitors continue to onboarding or the dashboard |
| `/onboarding`, `/dashboard` | `routes/_app/*` | Client-only; signed-out visitors go to `/login` |

Route files stay thin: they wire loaders, guards and titles to what a feature's
`index.ts` exports.

### Feature modules

Only create the pieces a feature needs.

| Location in a feature | Responsibility |
| --- | --- |
| `api/` | Supabase calls and TanStack Start server functions |
| `components/` | The feature's UI |
| `hooks/` | Query options, mutations and feature hooks |
| `schemas/` | Zod schemas and their types |
| `constants.ts` | Query and mutation keys, option lists |
| `types.ts` | Feature types |
| `utils/` | Feature helpers |
| `index.ts` | What the feature's routes use; only `src/routes` imports it |

The current features:

- `landing`: hero, "How it works" bento grid and closing call to action.
- `auth`: login and signup pages, their mutations and the email confirmation
  redirect.
- `profile`: profile server functions, schema, query options and
  `profileDestination`. Other features import its files directly.
- `onboarding`: the three-step profile wizard.
- `dashboard`: the dashboard bento grid.

## Forms

Forms use TanStack Form with Zod schemas.

- Fields come from `FormFields` in `@/components/shared/form-fields`: `Input`,
  `Password`, `Select` and `ToggleGroup` (pass `multiple` for a string array).
- Validate with `validators: { onBlur: schema, onSubmit: schema }`. When the
  schema transforms (for example a CGPA string into a number), type the
  defaults as `z.input<typeof schema>` and `schema.parse` the submitted value.
- In `onSubmit`, `await mutation.mutateAsync(...)` and catch failures so the
  form keeps the student's input. The mutation hook shows the toast.
- `onSubmitInvalid` focuses the first `[aria-invalid="true"]` control.
- A custom control (such as the skills tag field) renders `form.Field` with
  `FormFieldFrame`, `getFieldA11yIds` and `revalidateFieldIfStaleError` so it
  looks and behaves like the shared fields.

## UI

- shadcn components use Base UI (`@base-ui/react`). Compose with the `render`
  prop, never `asChild`. A `Button` rendered as a link also needs
  `nativeButton={false}`.
- Add components with `pnpm dlx shadcn@latest add <name>`; the preset and paths
  are in [components.json](./components.json).
- Toasts come from `toast.add(...)` in `@/components/ui/toast`.
- Colors come from the theme tokens in
  [src/styles/tokens](./src/styles/tokens/): the cream canvas, purple primary
  (`#8B7CF6`) and five pastels, each with an `-ink` partner for icons and text on
  it. `TONE_CLASSES` in `@/constants/tones` maps a tone to its classes.
- Utilities in [src/styles/utilities.css](./src/styles/utilities.css):
  `card-soft` (bento card lift) and `btn-pop` (call-to-action hover and press).
  They use the `translate` and `scale` properties so they compose with Motion,
  only hover on devices with a real pointer, and respect reduced motion.
- Shape rule: pills for buttons and chips, `rounded-2xl` for cards,
  `rounded-xl` for inputs and panels inside cards.

## Motion

Animations use Motion (`motion/react`) through `LazyMotion`, which
`MotionProvider` sets up in the root route.

- Use the light `m` component (`m.div`), never `motion.div`: `strict` mode
  throws on a full `motion` component.
- Easing, shared variants (`riseIn`, `blurIn`, `popIn`,
  `riseInWithChildren`, `stagger`) and `REVEAL_ONCE` live in
  [src/lib/motion.ts](./src/lib/motion.ts). Define new variants outside
  components.
- A parent sets `initial="hidden"` and `animate="visible"` (on mount) or
  `whileInView="visible"` with `viewport={REVEAL_ONCE}` (on scroll); children
  with the same variant names follow it.
- The root loads `domAnimation`. `layout` and `layoutId` need `domMax`: wrap
  that subtree in `<LazyMotion features={loadLayoutFeatures}>` (the onboarding
  wizard does) so it loads on demand.
- Animate only `transform`, `opacity` and short `filter: blur()`. Entrances
  use the strong ease-out and stay around 0.3 to 0.6 seconds; exits are
  faster. Stagger items 30 to 120 ms apart.
- Motion answers the user or explains something: the hero's one load
  sequence, feature previews that act out the feature, step changes, tags,
  ticks and label swaps. Do not add looping or decorative motion.
- `MotionConfig reducedMotion="user"` drops movement (keeping fades) when the
  system asks for reduced motion. Hand-rolled animations, such as the match
  count-up, check `useReducedMotion()` themselves.
- Handle loading, empty, error and success states, and keep controls labelled
  and keyboard reachable.
