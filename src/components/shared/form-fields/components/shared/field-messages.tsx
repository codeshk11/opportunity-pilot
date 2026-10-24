import { AnimatePresence, m } from 'motion/react'
import { FIELD_CLASS_NAMES } from '../../constants'
import type { ReactNode } from 'react'

import type { FieldErrorValue } from '../../types/options'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { EASE_OUT } from '@/lib/motion'

function toErrorMessages(errors: Array<FieldErrorValue>) {
  return errors.flatMap((error) => {
    if (!error) return []
    return [typeof error === 'string' ? { message: error } : error]
  })
}

// A field's description and validation errors (which ease in), wired to the IDs the control
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
      <AnimatePresence initial={false}>
        {errors?.length ? (
          <m.div
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <FieldError id={errorId} errors={toErrorMessages(errors)} />
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
