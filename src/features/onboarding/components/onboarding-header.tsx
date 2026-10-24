import { ONBOARDING_STEPS } from '../constants'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress'

// Page heading and the progress bar across the three steps.
export function OnboardingHeader({ stepIndex }: { stepIndex: number }) {
  const step = ONBOARDING_STEPS[stepIndex]

  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="fade-up">
        <p className="text-sm font-semibold text-lavender-ink">
          A little about you
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Let's build your profile
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          OppPilot uses it to match you with opportunities you actually qualify
          for. Only you can see it.
        </p>
      </div>
      <Progress
        value={((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}
        className="w-full fade-up gap-2 md:max-w-xs"
        style={{ animationDelay: '60ms' }}
      >
        <ProgressLabel>
          Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
          {step ? `: ${step.title}` : null}
        </ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
