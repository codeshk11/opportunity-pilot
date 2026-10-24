import { useEffect, useRef } from 'react'
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react'
import type { ReactNode, RefObject } from 'react'

import { AnimatedLabel } from '@/components/shared/animated-label'
import { Button } from '@/components/ui/button'

// The frame every onboarding step shares: heading, fields, and Back /
// Continue actions. `onSubmit` should call the step form's `handleSubmit`.
// With `focusHeading`, the heading takes focus on mount, so keyboard and
// screen reader users land on the new step after Back or Continue.
export function StepForm({
  formRef,
  title,
  description,
  isLastStep = false,
  isSubmitting,
  focusHeading = false,
  onBack,
  onSubmit,
  children,
}: {
  formRef: RefObject<HTMLFormElement | null>
  title: string
  description: string
  isLastStep?: boolean
  isSubmitting: boolean
  focusHeading?: boolean
  onBack?: () => void
  onSubmit: () => void
  children: ReactNode
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (focusHeading) headingRef.current?.focus()
  }, [focusHeading])

  const submitState = isSubmitting ? 'saving' : isLastStep ? 'save' : 'next'

  return (
    <form
      ref={formRef}
      noValidate
      className="flex flex-col gap-7"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onSubmit()
      }}
    >
      <div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="scroll-mt-28 text-2xl font-bold tracking-tight outline-none md:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-1.5 text-foreground/70">{description}</p>
      </div>

      {children}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-6">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 rounded-full bg-card px-5"
            disabled={isSubmitting}
            onClick={onBack}
          >
            <IconArrowLeft data-icon="inline-start" />
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="submit"
          size="lg"
          className="h-11 btn-pop rounded-full px-6 font-semibold"
          disabled={isSubmitting}
        >
          <AnimatedLabel labelKey={submitState}>
            {submitState === 'saving' ? 'Saving…' : null}
            {submitState === 'save' ? (
              <>
                Save my profile
                <IconCheck data-icon="inline-end" />
              </>
            ) : null}
            {submitState === 'next' ? (
              <>
                Continue
                <IconArrowRight data-icon="inline-end" />
              </>
            ) : null}
          </AnimatedLabel>
        </Button>
      </div>
    </form>
  )
}
