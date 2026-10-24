// =============================================================================
// Field accessibility IDs
// =============================================================================
// IDs that tie a control to its label, description and error. Pass `useId()`
// as `fieldId` and spread the result onto the control and its messages.

interface GetFieldA11yIdsOptions {
  fieldId: string
  hasDescription: boolean
  hasErrors: boolean
}

export interface FieldA11yIds {
  controlId: string
  labelId: string
  descriptionId: string | undefined
  errorId: string | undefined
  describedBy: string | undefined
}

export function getFieldA11yIds({
  fieldId,
  hasDescription,
  hasErrors,
}: GetFieldA11yIdsOptions): FieldA11yIds {
  const descriptionId = hasDescription ? `${fieldId}-description` : undefined
  const errorId = hasErrors ? `${fieldId}-error` : undefined

  return {
    controlId: fieldId,
    labelId: `${fieldId}-label`,
    descriptionId,
    errorId,
    describedBy:
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
  }
}
