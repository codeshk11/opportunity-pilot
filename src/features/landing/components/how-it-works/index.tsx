import {
  IconBellRinging,
  IconHandFinger,
  IconShieldCheck,
  IconTargetArrow,
  IconWorldSearch,
} from '@tabler/icons-react'
import { m } from 'motion/react'

import { FeatureCard } from './feature-card'
import {
  DiscoverPreview,
  DiscoverTypes,
  MatchPreview,
  PrepPreview,
  SubmitPreview,
  VerifyPreview,
} from './previews'
import { REVEAL_ONCE, riseIn, stagger } from '@/lib/motion'

const grid = stagger(0.08)

// The bento grid of what the agent does. Six columns from md: Discover takes
// four columns and two rows; the rest fill around it. Cards rise in as the
// grid scrolls into view, then each one plays its preview.
export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6 md:pb-32"
    >
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_ONCE}
        variants={riseIn}
        className="mb-10 max-w-2xl md:mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
          One agent, from search to submit
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          OppPilot does the digging, checking and paperwork. The decisions stay
          with you.
        </p>
      </m.div>

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_ONCE}
        variants={grid}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 md:gap-5"
      >
        <FeatureCard
          title="Discover"
          icon={IconWorldSearch}
          tone="mint"
          isLarge
          tags={<DiscoverTypes />}
          className="sm:col-span-2 md:col-span-4 md:row-span-2"
          description="Scans scholarships, internships, hackathons and government schemes across India, every day, so you don't have to."
        >
          <DiscoverPreview />
        </FeatureCard>
        <FeatureCard
          title="Verify"
          icon={IconShieldCheck}
          tone="lavender"
          className="md:col-span-2"
          description="Checks every listing against official sources and flags scams before they reach you."
        >
          <VerifyPreview />
        </FeatureCard>
        <FeatureCard
          title="Match"
          icon={IconTargetArrow}
          tone="peach"
          className="md:col-span-2"
          description="Ranks opportunities by your course, state, income and skills."
        >
          <MatchPreview />
        </FeatureCard>
        <FeatureCard
          title="Prep & Remind"
          icon={IconBellRinging}
          tone="sky"
          className="md:col-span-3"
          description="Drafts essays, lists documents and nudges you before deadlines."
        >
          <PrepPreview />
        </FeatureCard>
        <FeatureCard
          title="You always press submit"
          icon={IconHandFinger}
          tone="butter"
          className="md:col-span-3"
          description="OppPilot prepares everything, but never applies on your behalf. You review, you decide, you hit submit."
        >
          <SubmitPreview />
        </FeatureCard>
      </m.div>
    </section>
  )
}
