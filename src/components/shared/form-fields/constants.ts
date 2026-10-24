// =============================================================================
// Field class names
// =============================================================================
// The look every form field shares: a medium label, a tall white control that
// reads well on pastel cards, and a small description. The FormFields fields
// apply it themselves; a custom field that renders Field* primitives puts these
// on the matching parts.

export const FIELD_CLASS_NAMES = {
  root: 'gap-2',
  label: 'text-sm font-medium',
  control: 'h-11 rounded-xl bg-card px-3',
  legend: 'text-sm font-medium',
  description: 'text-xs',
} as const
