import { IconRocket } from '@tabler/icons-react'

import type { OpportunityType } from '@/constants/opportunity-types'
import type { Profile } from '@/features/profile/types'
import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { OPPORTUNITY_TYPE_META } from '@/constants/opportunity-types'
import { TONE_CLASSES } from '@/constants/tones'
import { riseIn } from '@/lib/motion'
import { cn } from '@/lib/utils'

function isOpportunityType(value: string): value is OpportunityType {
  return value in OPPORTUNITY_TYPE_META
}

// What the student asked OppPilot to look for, and the skills they listed.
export function InterestsCard({
  profile,
  className,
}: {
  profile: Profile
  className?: string
}) {
  const interests = profile.interests.filter(isOpportunityType)

  return (
    <BentoCard
      tone="peach"
      variants={riseIn}
      className={cn('flex flex-col gap-5', className)}
    >
      <div className="flex items-center gap-3">
        <BentoIcon tone="peach">
          <IconRocket aria-hidden />
        </BentoIcon>
        <h2 className="text-xl font-bold tracking-tight">Looking for</h2>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Interests">
        {interests.map((interest) => {
          const meta = OPPORTUNITY_TYPE_META[interest]
          return (
            <li
              key={interest}
              className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-medium shadow-sm"
            >
              <meta.icon
                aria-hidden
                className={cn('size-4', TONE_CLASSES[meta.tone].ink)}
              />
              {meta.label}
            </li>
          )
        })}
      </ul>
      <div>
        <h3 className="text-sm font-medium text-foreground/60">Skills</h3>
        {profile.skills.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Skills">
            {profile.skills.map((skill) => (
              <li
                key={skill}
                className="max-w-full truncate rounded-full bg-card/70 px-2.5 py-1 text-xs"
              >
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-foreground/70">None added yet.</p>
        )}
      </div>
    </BentoCard>
  )
}
