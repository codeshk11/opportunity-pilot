import { useRef } from 'react'
import { IconLock } from '@tabler/icons-react'
import { useForm } from '@tanstack/react-form'

import { CATEGORY_OPTIONS, INCOME_OPTIONS } from '../../constants'
import { backgroundStepSchema } from '../../schemas/steps'
import { focusFirstInvalid } from '../../utils/focus-first-invalid'
import { StepForm } from '../step-form'
import type { BackgroundStepValues } from '../../schemas/steps'
import { FormFields } from '@/components/shared/form-fields'

export function BackgroundStep({
  defaultValues,
  focusHeading,
  onBack,
  onNext,
}: {
  // Move focus to the step heading on mount (after Back or Continue).
  focusHeading: boolean
  defaultValues: BackgroundStepValues
  // Receives the step's current values, valid or not, so going back keeps
  // them.
  onBack: (values: BackgroundStepValues) => void
  onNext: (values: BackgroundStepValues) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm({
    defaultValues,
    validators: {
      onBlur: backgroundStepSchema,
      onSubmit: backgroundStepSchema,
    },
    onSubmit: ({ value }) => onNext(value),
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
  })

  return (
    <StepForm
      formRef={formRef}
      focusHeading={focusHeading}
      title="The details that matter"
      description="Most scholarships and schemes set limits on these."
      isSubmitting={false}
      onBack={() => onBack(form.state.values)}
      onSubmit={() => void form.handleSubmit()}
    >
      <p className="flex items-center gap-2 rounded-xl bg-card/70 px-4 py-3 text-sm text-foreground/70">
        <IconLock className="size-4 shrink-0 text-peach-ink" aria-hidden />
        Private to you. OppPilot only uses it to check eligibility.
      </p>
      <FormFields.ToggleGroup
        form={form}
        name="category"
        label="Category"
        options={CATEGORY_OPTIONS}
        isRequired
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormFields.Select
          form={form}
          name="family_income_range"
          label="Annual family income"
          placeholder="Select a range"
          options={INCOME_OPTIONS}
          isRequired
        />
        <FormFields.Input
          form={form}
          name="cgpa"
          label="CGPA"
          placeholder="e.g. 8.5"
          inputMode="decimal"
          description="Out of 10."
          maxLength={5}
          isRequired
        />
      </div>
    </StepForm>
  )
}
