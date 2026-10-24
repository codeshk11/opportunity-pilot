import { useId, useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

import { FIELD_CLASS_NAMES } from '../../constants'
import { getFieldA11yIds } from '../../utils/field-a11y'
import { revalidateFieldIfStaleError } from '../../utils/revalidate-field'
import { FormFieldFrame } from '../shared/form-field-frame'
import type { PasswordFieldProps } from '../../types/field-props'
import type { FormFieldValue, FreeTextFieldName } from '../../types/base'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

// =============================================================================
// PasswordField
// =============================================================================
// A password input with a show/hide toggle.

export function PasswordField<
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
  autoComplete,
  maxLength,
}: PasswordFieldProps<TFormData, TName>) {
  const fieldId = useId()
  const [isVisible, setIsVisible] = useState(false)

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
            <InputGroup className={cn(FIELD_CLASS_NAMES.control, 'px-0')}>
              <InputGroupInput
                id={ids.controlId}
                name={field.name}
                type={isVisible ? 'text' : 'password'}
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
                disabled={disabled}
                autoComplete={autoComplete}
                maxLength={maxLength}
                aria-describedby={ids.describedBy}
                aria-invalid={isInvalid}
                aria-required={isRequired || undefined}
                className="px-3"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  aria-label={isVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={isVisible}
                  disabled={disabled}
                  onClick={() => setIsVisible((visible) => !visible)}
                >
                  {isVisible ? <IconEyeOff /> : <IconEye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </FormFieldFrame>
        )
      }}
    </form.Field>
  )
}
