import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AnimatePresence, LazyMotion, m } from 'motion/react'

import { ONBOARDING_STEPS } from '../constants'
import { useCompleteOnboardingMutation } from '../hooks/use-complete-onboarding-mutation'
import { getDefaultOnboardingValues, toProfileInput } from '../schemas/steps'
import { OnboardingHeader } from './onboarding-header'
import { StepRail } from './step-rail'
import { AmbitionsStep } from './steps/ambitions-step'
import { BackgroundStep } from './steps/background-step'
import { CampusStep } from './steps/campus-step'
import type { Variants } from 'motion/react'
import { BentoCard } from '@/components/shared/bento-card'
import { profileQueryOptions } from '@/features/profile/hooks/query-options'
import { EASE_OUT, loadLayoutFeatures, riseIn, stagger } from '@/lib/motion'

const page = stagger(0.08)

// Steps slide in the direction of travel: Continue brings the next step from
// the right, Back from the left. Exits are quicker than entrances.
const stepSlide = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 32 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -32,
    transition: { duration: 0.15, ease: EASE_OUT },
  }),
} satisfies Variants

// The three-step profile setup. Each step validates its own form; the wizard
// keeps every step's values so Back and Continue never lose input, and saves
// the profile after the last step.
export function OnboardingWizard() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions)
  // `direction` is 1 after Continue, -1 after Back and 0 before either.
  const [{ index: stepIndex, direction }, setStep] = useState({
    index: 0,
    direction: 0,
  })
  const [values, setValues] = useState(() =>
    getDefaultOnboardingValues(profile),
  )
  const completeOnboarding = useCompleteOnboardingMutation()
  const tone = ONBOARDING_STEPS[stepIndex]?.tone ?? 'mint'
  const hasMoved = direction !== 0

  function goTo(index: number) {
    setStep((current) => ({
      index,
      direction: index > current.index ? 1 : -1,
    }))
  }

  return (
    <LazyMotion features={loadLayoutFeatures}>
      <m.section
        initial="hidden"
        animate="visible"
        variants={page}
        className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pt-12"
      >
        <OnboardingHeader stepIndex={stepIndex} />
        <div className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-5">
          <StepRail currentIndex={stepIndex} />
          <BentoCard
            tone={tone}
            interactive={false}
            variants={riseIn}
            className="min-w-0 transition-colors duration-300 ease-out md:p-9"
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <m.div
                key={stepIndex}
                custom={direction}
                variants={stepSlide}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {stepIndex === 0 ? (
                  <CampusStep
                    defaultValues={values.campus}
                    focusHeading={hasMoved}
                    onNext={(campus) => {
                      setValues((current) => ({ ...current, campus }))
                      goTo(1)
                    }}
                  />
                ) : null}
                {stepIndex === 1 ? (
                  <BackgroundStep
                    defaultValues={values.background}
                    focusHeading={hasMoved}
                    onBack={(background) => {
                      setValues((current) => ({ ...current, background }))
                      goTo(0)
                    }}
                    onNext={(background) => {
                      setValues((current) => ({ ...current, background }))
                      goTo(2)
                    }}
                  />
                ) : null}
                {stepIndex === 2 ? (
                  <AmbitionsStep
                    defaultValues={values.ambitions}
                    focusHeading={hasMoved}
                    onBack={(ambitions) => {
                      setValues((current) => ({ ...current, ambitions }))
                      goTo(1)
                    }}
                    onSubmit={(ambitions) => {
                      const finished = { ...values, ambitions }
                      setValues(finished)
                      return completeOnboarding.mutateAsync(
                        toProfileInput(finished),
                      )
                    }}
                  />
                ) : null}
              </m.div>
            </AnimatePresence>
          </BentoCard>
        </div>
      </m.section>
    </LazyMotion>
  )
}
