// New Supabase API keys (sb_publishable_..., sb_secret_...) are opaque strings,
// not JWTs, so they travel in the `apikey` header only and are never sent as a
// bearer token. Pass the result as `global.fetch` to `createClient`.
export function createSupabaseFetch(supabaseKey: string): typeof fetch {
  const isOpaqueKey =
    supabaseKey.startsWith('sb_publishable_') ||
    supabaseKey.startsWith('sb_secret_')

  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request
        ? input.headers
        : undefined,
    )
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value))
    }
    if (
      isOpaqueKey &&
      headers.get('Authorization') === `Bearer ${supabaseKey}`
    ) {
      headers.delete('Authorization')
    }
    headers.set('apikey', supabaseKey)
    return fetch(input, { ...init, headers })
  }
}
