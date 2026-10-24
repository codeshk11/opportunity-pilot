import { FIELD_CLASS_NAMES } from '../../constants'
import { FieldMessages } from './field-messages'
import { RequiredLabel } from './required-label'
import type { ReactNode } from 'react'

import type { FieldErrorValue } from '../../types/options'
import type { FieldA11yIds } from '../../utils/field-a11y'
import { Field, FieldLabel } from '@/components/ui/field'

// The label, control slot and messages around one form control. Shared fields
// render it themselves; a custom field wraps its control in it.
export function FormFieldFrame({
  ids,
  label,
  isRequired,
  description,
  errors,
  isInvalid,
  disabled,
  children,
}: {
  ids: FieldA11yIds
  label: string
  isRequired?: boolean
  description?: ReactNode
  errors?: Array<FieldErrorValue>
  isInvalid: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <Field
      data-invalid={isInvalid}
      data-disabled={disabled}
      className={FIELD_CLASS_NAMES.root}
    >
      <FieldLabel
        id={ids.labelId}
        htmlFor={ids.controlId}
        className={FIELD_CLASS_NAMES.label}
      >
        <RequiredLabel isRequired={isRequired}>{label}</RequiredLabel>
      </FieldLabel>
      {children}
      <FieldMessages
        description={description}
        errors={errors}
        descriptionId={ids.descriptionId}
        errorId={ids.errorId}
      />
    </Field>
  )
}
