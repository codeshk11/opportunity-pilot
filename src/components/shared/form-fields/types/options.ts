import type { ReactNode } from 'react'

// A validation error as TanStack Form reports it: a Standard Schema issue from
// Zod, or a plain message from a custom validator.
export type FieldErrorValue = { message?: string } | string | null | undefined

export interface FieldOption<TValue extends string = string> {
  value: TValue
  label: string
  // Rich content shown in place of the label, such as an icon and text.
  content?: ReactNode
}
