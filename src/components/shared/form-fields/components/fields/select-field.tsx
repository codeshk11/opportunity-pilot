import { useId } from 'react'

import { FIELD_CLASS_NAMES } from '../../constants'
import { getFieldA11yIds } from '../../utils/field-a11y'
import { revalidateFieldIfStaleError } from '../../utils/revalidate-field'
import { FormFieldFrame } from '../shared/form-field-frame'
import type { SelectFieldProps } from '../../types/field-props'
import type { StringFieldName, StringFieldValue } from '../../types/base'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// =============================================================================
// SelectField
// =============================================================================
// Single choice from a fixed option list. An empty string means "not chosen".

export function SelectField<
  TFormData,
  TName extends StringFieldName<TFormData>,
>({
  form,
  name,
  label,
  isRequired,
  description,
  disabled,
  fieldOptions,
  options,
  placeholder = 'Select an option',
}: SelectFieldProps<TFormData, TName>) {
  type TValue = StringFieldValue<TFormData, TName>
  const fieldId = useId()
  const items = options.map(({ value, label: itemLabel }) => ({
    value,
    label: itemLabel,
  }))

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
        const value = options.find(
          (option) => option.value === field.state.value,
        )?.value

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
            <Select<TValue>
              name={field.name}
              disabled={disabled}
              items={items}
              value={value ?? null}
              onOpenChange={(open) => {
                if (!open) field.handleBlur()
              }}
              onValueChange={(nextValue) => {
                if (nextValue === null) return
                field.handleChange(nextValue)
                revalidateFieldIfStaleError(field)
              }}
            >
              <SelectTrigger
                id={ids.controlId}
                aria-describedby={ids.describedBy}
                aria-invalid={isInvalid}
                aria-required={isRequired || undefined}
                className={cn(
                  FIELD_CLASS_NAMES.control,
                  // The trigger sets its own height per size; match inputs.
                  'w-full data-[size=default]:h-11',
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="max-h-72">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.content ?? option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
        )
      }}
    </form.Field>
  )
}
