// Supabase auth errors carry a readable message; anything else gets the
// fallback.
export function getAuthErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}
