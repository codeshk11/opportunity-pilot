import { AnimatePresence, m } from 'motion/react'
import type { ReactNode } from 'react'

import { EASE_OUT } from '@/lib/motion'

// A button label that cross-fades when it changes, such as "Log in" to
// "Logging in…". A short blur hides the swap. Change `labelKey` whenever the
// label should animate.
export function AnimatedLabel({
  labelKey,
  children,
}: {
  labelKey: string
  children: ReactNode
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.span
        key={labelKey}
        className="inline-flex items-center gap-1.5"
        initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{
          opacity: 0,
          y: -6,
          filter: 'blur(4px)',
          transition: { duration: 0.12, ease: EASE_OUT },
        }}
        transition={{ duration: 0.18, ease: EASE_OUT }}
      >
        {children}
      </m.span>
    </AnimatePresence>
  )
}
