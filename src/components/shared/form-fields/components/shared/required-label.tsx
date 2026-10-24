import type { ReactNode } from 'react'

// A label's text with an accessible "required" marker.
export function RequiredLabel({
  children,
  isRequired,
}: {
  children: ReactNode
  isRequired?: boolean
}) {
  return (
    <span className="inline-flex gap-0.5">
      {children}
      {isRequired ? (
        <>
          <span aria-hidden className="text-destructive">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : null}
    </span>
  )
}
