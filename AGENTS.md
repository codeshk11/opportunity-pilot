<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Account pages live under the client-only `_authenticated` layout; public pages remain outside it so refresh works with browser-held sessions.
- Student profile reads and saves use authenticated server functions with a shared validation schema; the caller's user ID always comes from verified middleware.
- Signup creates an empty profile via a trigger; only a profile with `completed_at` counts as onboarded, so new accounts cannot skip onboarding.
- Root owns the single identity-change subscriber and account context; logout cancels queries and clears private cached data before replacing navigation.
