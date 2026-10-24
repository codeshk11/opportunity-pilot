import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

import { ONBOARDING_STEPS } from '../constants'
import { useCompleteOnboardingMutation } from '../hooks/use-complete-onboarding-mutation'
import { getDefaultOnboardingValues, toProfileInput } from '../schemas/steps'
import { OnboardingHeader } from './onboarding-header'
import { StepRail } from './step-rail'
import { AmbitionsStep } from './steps/ambitions-step'
import { BackgroundStep } from './steps/background-step'
import { CampusStep } from './steps/campus-step'
import { BentoCard } from '@/components/shared/bento-card'
import { profileQueryOptions } from '@/features/profile/hooks/query-options'

// The three-step profile setup. Each step validates its own form; the wizard
// keeps every step's values so Back and Continue never lose input, and saves
// the profile after the last step.
export function OnboardingWizard() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions)
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState(() =>
    getDefaultOnboardingValues(profile),
  )
  const completeOnboarding = useCompleteOnboardingMutation()
  const tone = ONBOARDING_STEPS[stepIndex]?.tone ?? 'mint'

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pt-12">
      <OnboardingHeader stepIndex={stepIndex} />
      <div className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-5">
        <StepRail currentIndex={stepIndex} />
        <BentoCard
          // Remount per step so the entrance plays and each form starts from
          // its saved values.
          key={stepIndex}
          tone={tone}
          interactive={false}
          className="min-w-0 md:p-9"
        >
          {stepIndex === 0 ? (
            <CampusStep
              defaultValues={values.campus}
              onNext={(campus) => {
                setValues((current) => ({ ...current, campus }))
                setStepIndex(1)
              }}
            />
          ) : null}
          {stepIndex === 1 ? (
            <BackgroundStep
              defaultValues={values.background}
              onBack={(background) => {
                setValues((current) => ({ ...current, background }))
                setStepIndex(0)
              }}
              onNext={(background) => {
                setValues((current) => ({ ...current, background }))
                setStepIndex(2)
              }}
            />
          ) : null}
          {stepIndex === 2 ? (
            <AmbitionsStep
              defaultValues={values.ambitions}
              onBack={(ambitions) => {
                setValues((current) => ({ ...current, ambitions }))
                setStepIndex(1)
              }}
              onSubmit={(ambitions) => {
                const finished = { ...values, ambitions }
                setValues(finished)
                return completeOnboarding.mutateAsync(toProfileInput(finished))
              }}
            />
          ) : null}
        </BentoCard>
      </div>
    </section>
  )
}
