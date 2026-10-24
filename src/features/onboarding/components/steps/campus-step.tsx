import { useRef } from 'react'
import { useForm } from '@tanstack/react-form'

import { STATE_OPTIONS, YEAR_OPTIONS } from '../../constants'
import { campusStepSchema } from '../../schemas/steps'
import { focusFirstInvalid } from '../../utils/focus-first-invalid'
import { StepForm } from '../step-form'
import type { CampusStepValues } from '../../schemas/steps'
import { FormFields } from '@/components/shared/form-fields'

export function CampusStep({
  defaultValues,
  onNext,
}: {
  defaultValues: CampusStepValues
  onNext: (values: CampusStepValues) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm({
    defaultValues,
    validators: { onBlur: campusStepSchema, onSubmit: campusStepSchema },
    onSubmit: ({ value }) => onNext(value),
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
  })

  return (
    <StepForm
      formRef={formRef}
      title="Hello, campus explorer"
      description="Where you study decides many of the scholarships and schemes you can apply for."
      isSubmitting={false}
      onSubmit={() => void form.handleSubmit()}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormFields.Input
          form={form}
          name="name"
          label="Full name"
          placeholder="As on your college ID"
          autoComplete="name"
          maxLength={100}
          isRequired
        />
        <FormFields.Input
          form={form}
          name="college"
          label="College"
          placeholder="Your college or university"
          autoComplete="organization"
          maxLength={200}
          isRequired
        />
        <FormFields.Input
          form={form}
          name="branch"
          label="Branch"
          placeholder="e.g. Computer Science"
          maxLength={100}
          isRequired
        />
        <FormFields.Select
          form={form}
          name="year"
          label="Year"
          placeholder="Select your year"
          options={YEAR_OPTIONS}
          isRequired
        />
        <div className="sm:col-span-2">
          <FormFields.Select
            form={form}
            name="state"
            label="State"
            placeholder="Select your state"
            description="Where you live, for state schemes and domicile quotas."
            options={STATE_OPTIONS}
            isRequired
          />
        </div>
      </div>
    </StepForm>
  )
}
