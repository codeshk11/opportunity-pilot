import { FIELD_CLASS_NAMES } from '../../constants'
import type { ReactNode } from 'react'

import type { FieldErrorValue } from '../../types/options'
import { FieldDescription, FieldError } from '@/components/ui/field'

function toErrorMessages(errors: Array<FieldErrorValue>) {
  return errors.flatMap((error) => {
    if (!error) return []
    return [typeof error === 'string' ? { message: error } : error]
  })
}

// A field's description and validation errors, wired to the IDs the control
// references in `aria-describedby`.
export function FieldMessages({
  description,
  errors,
  descriptionId,
  errorId,
}: {
  description?: ReactNode
  errors?: Array<FieldErrorValue>
  descriptionId?: string
  errorId?: string
}) {
  return (
    <>
      {description ? (
        <FieldDescription
          id={descriptionId}
          className={FIELD_CLASS_NAMES.description}
        >
          {description}
        </FieldDescription>
      ) : null}
      {errors?.length ? (
        <FieldError id={errorId} errors={toErrorMessages(errors)} />
      ) : null}
    </>
  )
}
