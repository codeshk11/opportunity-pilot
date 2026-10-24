import type { Variants } from 'motion/react'

// =============================================================================
// Easing
// =============================================================================
// A strong ease-out for anything entering or answering the user, and
// ease-in-out for things moving across the screen. Mirrors
// --motion-ease-out / --motion-ease-in-out in src/styles/tokens/base.css.

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

// =============================================================================
// Variants
// =============================================================================
// Every variant set uses `hidden` and `visible`. Put `initial="hidden"` and
// either `animate="visible"` (on mount) or `whileInView="visible"` (on scroll)
// on a parent; children with these variants follow it. Defined here, outside
// components, so their identity never changes between renders.

// Fades up 16px. The default entrance for cards and panels.
export const riseIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
} satisfies Variants

// Fades up while a soft blur clears. For short runs of display text.
export const blurIn = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE_OUT },
  },
} satisfies Variants

// `riseIn` that then plays its own children, `staggerChildren` seconds apart
// after `delayChildren`. For cards whose contents follow them in.
export function riseInWithChildren(
  staggerChildren: number,
  delayChildren: number,
) {
  return {
    hidden: riseIn.hidden,
    visible: {
      ...riseIn.visible,
      transition: {
        ...riseIn.visible.transition,
        staggerChildren,
        delayChildren,
      },
    },
  } satisfies Variants
}

// A small pop for an icon confirming a change. Starts at 0.6 scale, never 0.
export const popIn = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', duration: 0.35, bounce: 0.2 },
  },
} satisfies Variants

// Parent variants that only sequence their children, `staggerChildren`
// seconds apart after `delayChildren`.
export function stagger(staggerChildren: number, delayChildren = 0) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  } satisfies Variants
}

// Viewport options for scroll reveals: play once, when a fifth is in view.
export const REVEAL_ONCE = { once: true, amount: 0.2 } as const

// =============================================================================
// Features
// =============================================================================
// The root loads `domAnimation` (entrances, gestures, exits). Layout
// animations (`layout`, `layoutId`) need `domMax`; wrap the subtree that uses
// them in `<LazyMotion features={loadLayoutFeatures}>` so it loads on demand.

export const loadLayoutFeatures = () =>
  import('./motion-features').then((features) => features.default)
