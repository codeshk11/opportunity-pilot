// The five pastel surfaces of the OppPilot theme. Each pairs a soft background
// with an `-ink` color for icons and text placed on it. Class names are
// literal so Tailwind can see them.
export const TONE_CLASSES = {
  mint: { surface: 'bg-mint', ink: 'text-mint-ink' },
  lavender: { surface: 'bg-lavender', ink: 'text-lavender-ink' },
  peach: { surface: 'bg-peach', ink: 'text-peach-ink' },
  sky: { surface: 'bg-sky', ink: 'text-sky-ink' },
  butter: { surface: 'bg-butter', ink: 'text-butter-ink' },
} as const

export type Tone = keyof typeof TONE_CLASSES
