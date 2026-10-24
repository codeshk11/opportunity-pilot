import { Logo } from '@/components/shared/logo'

// Route-level pending view. Static on purpose: no spinner repainting the page.
export function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen items-center justify-center"
    >
      <Logo className="pointer-events-none opacity-60" />
    </div>
  )
}
