import { IconId } from '@tabler/icons-react'

import type { Profile } from '@/features/profile/types'
import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { YEAR_LABELS } from '@/features/profile/constants'
import { cn } from '@/lib/utils'

function yearLabel(year: string | null) {
  return year && year in YEAR_LABELS
    ? YEAR_LABELS[year as keyof typeof YEAR_LABELS]
    : year
}

// The facts eligibility checks use, as the student entered them.
export function ProfileCard({
  profile,
  className,
}: {
  profile: Profile
  className?: string
}) {
  const rows = [
    ['College', profile.college],
    [
      'Course',
      [profile.branch, yearLabel(profile.year)].filter(Boolean).join(' · '),
    ],
    ['State', profile.state],
    ['Category', profile.category],
    ['Family income', profile.family_income_range],
    ['CGPA', profile.cgpa?.toString()],
  ] as const

  return (
    <BentoCard
      tone="lavender"
      delay={160}
      className={cn('flex flex-col gap-5', className)}
    >
      <div className="flex items-center gap-3">
        <BentoIcon tone="lavender">
          <IconId aria-hidden />
        </BentoIcon>
        <h2 className="text-xl font-bold tracking-tight">Your profile</h2>
      </div>
      <dl className="grid gap-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-foreground/60">{label}</dt>
            <dd className="text-right font-medium break-words">
              {value || 'Not set'}
            </dd>
          </div>
        ))}
      </dl>
    </BentoCard>
  )
}
