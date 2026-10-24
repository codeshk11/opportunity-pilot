import { useId } from 'react'
import { IconCheck } from '@tabler/icons-react'
import { AnimatePresence, m } from 'motion/react'

import { FIELD_CLASS_NAMES } from '../../constants'
import { getFieldA11yIds } from '../../utils/field-a11y'
import { revalidateFieldIfStaleError } from '../../utils/revalidate-field'
import { FieldMessages } from '../shared/field-messages'
import { RequiredLabel } from '../shared/required-label'
import type {
  FormFieldValue,
  StringArrayFieldName,
  StringFieldName,
} from '../../types/base'
import type {
  MultiToggleGroupFieldProps,
  ToggleGroupFieldProps,
} from '../../types/field-props'
import type { FieldErrorValue, FieldOption } from '../../types/options'
import type { FieldA11yIds } from '../../utils/field-a11y'
import { Field } from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { popIn } from '@/lib/motion'

// =============================================================================
// ToggleGroupField
// =============================================================================
// Choice chips. A string field takes one option; pass `multiple` on a string[]
// field to take several. Overloads dispatch to the matching control.

export function ToggleGroupField<
  TFormData,
  TName extends StringFieldName<TFormData>,
>(props: ToggleGroupFieldProps<TFormData, TName>): React.JSX.Element
export function ToggleGroupField<
  TFormData,
  TName extends StringArrayFieldName<TFormData>,
>(props: MultiToggleGroupFieldProps<TFormData, TName>): React.JSX.Element
export function ToggleGroupField<TFormData>(
  props:
    | ToggleGroupFieldProps<TFormData, StringFieldName<TFormData>>
    | MultiToggleGroupFieldProps<TFormData, StringArrayFieldName<TFormData>>,
) {
  return props.multiple === true ? (
    <MultiToggleGroupControl {...props} />
  ) : (
    <SingleToggleGroupControl {...props} />
  )
}

// =============================================================================
// SingleToggleGroupControl
// =============================================================================

function SingleToggleGroupControl<
  TFormData,
  TName extends StringFieldName<TFormData>,
>({
  form,
  name,
  fieldOptions,
  ...chipProps
}: ToggleGroupFieldProps<TFormData, TName>) {
  const fieldId = useId()

  return (
    <form.Field name={name} {...fieldOptions}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        const value: unknown = field.state.value

        return (
          <ToggleChips
            {...chipProps}
            fieldId={fieldId}
            errors={isInvalid ? field.state.meta.errors : undefined}
            isInvalid={isInvalid}
            selected={typeof value === 'string' && value ? [value] : []}
            onValueChange={(values) => {
              // Pressing the chosen chip again keeps it chosen: there is no
              // "nothing chosen" state to return to.
              const next = values.at(-1)
              if (next === undefined) return
              field.handleChange(next as FormFieldValue<TFormData, TName>)
              revalidateFieldIfStaleError(field)
              field.handleBlur()
            }}
          />
        )
      }}
    </form.Field>
  )
}

// =============================================================================
// MultiToggleGroupControl
// =============================================================================

function MultiToggleGroupControl<
  TFormData,
  TName extends StringArrayFieldName<TFormData>,
>({
  form,
  name,
  fieldOptions,
  ...chipProps
}: MultiToggleGroupFieldProps<TFormData, TName>) {
  const fieldId = useId()

  return (
    <form.Field name={name} {...fieldOptions}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        const value: unknown = field.state.value

        return (
          <ToggleChips
            {...chipProps}
            fieldId={fieldId}
            errors={isInvalid ? field.state.meta.errors : undefined}
            isInvalid={isInvalid}
            selected={
              Array.isArray(value)
                ? value.filter(
                    (item): item is string => typeof item === 'string',
                  )
                : []
            }
            onValueChange={(values) => {
              field.handleChange(values as FormFieldValue<TFormData, TName>)
              revalidateFieldIfStaleError(field)
              field.handleBlur()
            }}
          />
        )
      }}
    </form.Field>
  )
}

// =============================================================================
// ToggleChips
// =============================================================================

function ToggleChips({
  fieldId,
  label,
  isRequired,
  description,
  disabled,
  options,
  multiple,
  selected,
  errors,
  isInvalid,
  onValueChange,
}: {
  fieldId: string
  label: string
  isRequired?: boolean
  description?: React.ReactNode
  disabled?: boolean
  options: ReadonlyArray<FieldOption>
  multiple?: boolean
  selected: Array<string>
  errors: Array<FieldErrorValue> | undefined
  isInvalid: boolean
  onValueChange: (values: Array<string>) => void
}) {
  const ids: FieldA11yIds = getFieldA11yIds({
    fieldId,
    hasDescription: Boolean(description),
    hasErrors: Boolean(errors?.length),
  })

  return (
    <Field
      data-invalid={isInvalid}
      data-disabled={disabled}
      className={FIELD_CLASS_NAMES.root}
    >
      <span id={ids.labelId} className={FIELD_CLASS_NAMES.label}>
        <RequiredLabel isRequired={isRequired}>{label}</RequiredLabel>
      </span>
      <ToggleGroup
        multiple={multiple}
        aria-labelledby={ids.labelId}
        aria-describedby={ids.describedBy}
        aria-invalid={isInvalid}
        value={selected}
        onValueChange={onValueChange}
        variant="outline"
        spacing={2}
        className="w-full flex-wrap"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            disabled={disabled}
            className="h-11 rounded-full border-input bg-card px-4 data-pressed:border-primary data-pressed:bg-lavender data-pressed:text-lavender-ink"
          >
            <AnimatePresence initial={false}>
              {selected.includes(option.value) ? (
                <m.span
                  key="check"
                  data-icon="inline-start"
                  variants={popIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="inline-flex"
                >
                  <IconCheck />
                </m.span>
              ) : null}
            </AnimatePresence>
            {option.content ?? option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <FieldMessages
        description={description}
        errors={errors}
        descriptionId={ids.descriptionId}
        errorId={ids.errorId}
      />
    </Field>
  )
}
