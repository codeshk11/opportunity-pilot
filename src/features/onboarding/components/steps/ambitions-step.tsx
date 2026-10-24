import { useRef } from 'react'
import { useForm } from '@tanstack/react-form'

import { ambitionsStepSchema } from '../../schemas/steps'
import { focusFirstInvalid } from '../../utils/focus-first-invalid'
import { SkillsField } from '../fields/skills-field'
import { StepForm } from '../step-form'
import type { AmbitionsStepValues } from '../../schemas/steps'
import { FormFields } from '@/components/shared/form-fields'
import {
  OPPORTUNITY_TYPES,
  OPPORTUNITY_TYPE_META,
} from '@/constants/opportunity-types'

const INTEREST_OPTIONS = OPPORTUNITY_TYPES.map((type) => {
  const meta = OPPORTUNITY_TYPE_META[type]
  return {
    value: type,
    label: meta.label,
    content: (
      <>
        <meta.icon aria-hidden data-icon="inline-start" />
        {meta.label}
      </>
    ),
  }
})

export function AmbitionsStep({
  defaultValues,
  focusHeading,
  onBack,
  onSubmit,
}: {
  // Move focus to the step heading on mount (after Back or Continue).
  focusHeading: boolean
  defaultValues: AmbitionsStepValues
  onBack: (values: AmbitionsStepValues) => void
  // Saves the whole profile; failures are reported by the mutation hook.
  onSubmit: (values: AmbitionsStepValues) => Promise<unknown>
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm({
    defaultValues,
    validators: { onBlur: ambitionsStepSchema, onSubmit: ambitionsStepSchema },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value)
      } catch {
        // The mutation hook already told the student; keep their input.
      }
    },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
  })

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <StepForm
          formRef={formRef}
          focusHeading={focusHeading}
          title="What's on your horizon?"
          description="Pick what OppPilot should look for. You can change it later."
          isLastStep
          isSubmitting={isSubmitting}
          onBack={() => onBack(form.state.values)}
          onSubmit={() => void form.handleSubmit()}
        >
          <FormFields.ToggleGroup
            form={form}
            name="interests"
            label="Interests"
            options={INTEREST_OPTIONS}
            multiple
            isRequired
          />
          <SkillsField form={form} />
        </StepForm>
      )}
    </form.Subscribe>
  )
}
