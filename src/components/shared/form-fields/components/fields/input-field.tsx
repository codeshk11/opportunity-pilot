import { useId } from 'react'

import { FIELD_CLASS_NAMES } from '../../constants'
import { getFieldA11yIds } from '../../utils/field-a11y'
import { revalidateFieldIfStaleError } from '../../utils/revalidate-field'
import { FormFieldFrame } from '../shared/form-field-frame'
import type { InputFieldProps } from '../../types/field-props'
import type { FormFieldValue, FreeTextFieldName } from '../../types/base'
import { Input } from '@/components/ui/input'

// =============================================================================
// InputField
// =============================================================================

export function InputField<
  TFormData,
  TName extends FreeTextFieldName<TFormData>,
>({
  form,
  name,
  label,
  isRequired,
  description,
  disabled,
  fieldOptions,
  placeholder,
  type,
  inputMode,
  min,
  max,
  step,
  maxLength,
  autoComplete,
}: InputFieldProps<TFormData, TName>) {
  const fieldId = useId()

  return (
    <form.Field name={name} {...fieldOptions}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        const errors = isInvalid ? field.state.meta.errors : undefined
        const ids = getFieldA11yIds({
          fieldId,
          hasDescription: Boolean(description),
          hasErrors: Boolean(errors?.length),
        })

        return (
          <FormFieldFrame
            ids={ids}
            label={label}
            isRequired={isRequired}
            description={description}
            errors={errors}
            isInvalid={isInvalid}
            disabled={disabled}
          >
            <Input
              id={ids.controlId}
              name={field.name}
              value={
                typeof field.state.value === 'string' ? field.state.value : ''
              }
              onBlur={field.handleBlur}
              onChange={(event) => {
                field.handleChange(
                  event.target.value as FormFieldValue<TFormData, TName>,
                )
                revalidateFieldIfStaleError(field)
              }}
              placeholder={placeholder}
              type={type}
              inputMode={inputMode}
              min={min}
              max={max}
              step={step}
              maxLength={maxLength}
              disabled={disabled}
              autoComplete={autoComplete}
              aria-describedby={ids.describedBy}
              aria-invalid={isInvalid}
              aria-required={isRequired || undefined}
              className={FIELD_CLASS_NAMES.control}
            />
          </FormFieldFrame>
        )
      }}
    </form.Field>
  )
}
