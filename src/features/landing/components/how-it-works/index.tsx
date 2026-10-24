import {
  IconBellRinging,
  IconHandFinger,
  IconShieldCheck,
  IconTargetArrow,
  IconWorldSearch,
} from '@tabler/icons-react'

import { FeatureCard } from './feature-card'
import {
  DiscoverPreview,
  MatchPreview,
  PrepPreview,
  SubmitPreview,
  VerifyPreview,
} from './previews'

// The bento grid of what the agent does. Six columns from md: Discover takes
// four columns and two rows; the rest fill around it.
export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 md:pb-28"
    >
      <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-lavender-ink">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            One agent, from search to submit
          </h2>
        </div>
        <p className="max-w-sm text-muted-foreground">
          OppPilot does the digging, checking and paperwork. The decisions stay
          with you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 md:gap-5">
        <FeatureCard
          title="Discover"
          icon={IconWorldSearch}
          tone="mint"
          isLarge
          delay={400}
          className="sm:col-span-2 md:col-span-4 md:row-span-2"
          description="Scans scholarships, internships, hackathons and government schemes across India, every day, so you don't have to."
        >
          <DiscoverPreview />
        </FeatureCard>
        <FeatureCard
          title="Verify"
          icon={IconShieldCheck}
          tone="lavender"
          delay={480}
          className="md:col-span-2"
          description="Checks every listing against official sources and flags scams before they reach you."
        >
          <VerifyPreview />
        </FeatureCard>
        <FeatureCard
          title="Match"
          icon={IconTargetArrow}
          tone="peach"
          delay={560}
          className="md:col-span-2"
          description="Ranks opportunities by your course, state, income and skills."
        >
          <MatchPreview />
        </FeatureCard>
        <FeatureCard
          title="Prep & Remind"
          icon={IconBellRinging}
          tone="sky"
          delay={640}
          className="md:col-span-3"
          description="Drafts essays, lists documents and nudges you before deadlines."
        >
          <PrepPreview />
        </FeatureCard>
        <FeatureCard
          title="You always press submit"
          icon={IconHandFinger}
          tone="butter"
          delay={720}
          className="md:col-span-3"
          description="OppPilot prepares everything, but never applies on your behalf. You review, you decide, you hit submit."
        >
          <SubmitPreview />
        </FeatureCard>
      </div>
    </section>
  )
}
