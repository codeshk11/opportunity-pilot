import { m } from 'motion/react'

import { ONBOARDING_STEPS } from '../constants'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress'
import { riseIn } from '@/lib/motion'

// Page heading and the progress bar across the three steps.
export function OnboardingHeader({ stepIndex }: { stepIndex: number }) {
  const step = ONBOARDING_STEPS[stepIndex]

  return (
    <m.div
      variants={riseIn}
      className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Let's build your profile
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          OppPilot uses it to match you with opportunities you actually qualify
          for. Only you can see it.
        </p>
      </div>
      <Progress
        value={((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}
        className="w-full gap-2 md:max-w-xs"
      >
        <ProgressLabel>
          Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
          {step ? `: ${step.title}` : null}
        </ProgressLabel>
        <ProgressValue />
      </Progress>
    </m.div>
  )
}
