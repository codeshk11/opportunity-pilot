import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'

import { EASE_OUT } from '@/lib/motion'

// Wraps the app once, in the root route. Components animate with the light
// `m` component; `strict` throws if a full `motion` component slips in.
// `reducedMotion="user"` drops movement (keeping fades) for people who ask
// their system for less motion.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
