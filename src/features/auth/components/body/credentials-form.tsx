import { useRef } from 'react'
import { useForm } from '@tanstack/react-form'

import {
  getDefaultCredentials,
  loginSchema,
  signupSchema,
} from '../../schemas/credentials'
import type { Credentials } from '../../schemas/credentials'
import { AnimatedLabel } from '@/components/shared/animated-label'
import { FormFields } from '@/components/shared/form-fields'
import { FieldGroup } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

// Email and password form for both auth pages. `onSubmit` should await the
// mutation; its hook shows the toast when it fails.
export function CredentialsForm({
  mode,
  submitLabel,
  pendingLabel,
  onSubmit,
}: {
  mode: 'login' | 'signup'
  submitLabel: string
  // Shown while the request runs, such as "Logging in…".
  pendingLabel: string
  onSubmit: (credentials: Credentials) => Promise<unknown>
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const schema = mode === 'login' ? loginSchema : signupSchema

  const form = useForm({
    defaultValues: getDefaultCredentials(),
    validators: { onBlur: schema, onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(schema.parse(value))
      } catch {
        // The mutation hook already told the student; keep their input.
      }
    },
    onSubmitInvalid: () => {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus()
      })
    },
  })

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <FormFields.Input
          form={form}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          maxLength={255}
          isRequired
        />
        <FormFields.Password
          form={form}
          name="password"
          label="Password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          description={mode === 'signup' ? 'At least 8 characters.' : undefined}
          maxLength={128}
          isRequired
        />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full btn-pop rounded-full text-base font-semibold"
            >
              <AnimatedLabel labelKey={isSubmitting ? 'busy' : 'idle'}>
                {isSubmitting ? pendingLabel : submitLabel}
              </AnimatedLabel>
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  )
}
