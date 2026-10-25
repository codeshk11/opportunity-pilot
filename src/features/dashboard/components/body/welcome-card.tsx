import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { IconSearch, IconSparkles, IconDownload } from '@tabler/icons-react'

import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { findOpportunities } from '@/features/dashboard/api/find-opportunities'
import { getAutofillProfile } from '@/features/dashboard/api/get-autofill-profile'
import { ApplyOnOppPilot } from './apply-on-opppilot'
import { riseIn } from '@/lib/motion'
import { cn } from '@/lib/utils'

const regionOptions = ['All regions', 'Your state', 'Across India', 'International', 'Not specified']
const yearOptions = ['All years', '1st year', '2nd year', 'Other years', 'Not specified']
const costOptions = ['All costs', 'Free', 'Paid', 'Not specified']

function getDeadlineDays(deadline: string | null): number | null {
  if (!deadline) return null
  const [year, month, day] = deadline.split('-').map(Number)
  const deadlineDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((deadlineDate.getTime() - today.getTime()) / 86_400_000)
}

function getDeadlineLabel(deadline: string | null): string {
  const daysLeft = getDeadlineDays(deadline)
  if (daysLeft === null) return 'Deadline not found'
  if (daysLeft < 0) return 'Deadline passed'
  if (daysLeft === 0) return 'Due today'
  if (daysLeft === 1) return '1 day left'
  return `${daysLeft} days left`
}

export function WelcomeCard({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const [regionFilter, setRegionFilter] = useState('All regions')
  const [yearFilter, setYearFilter] = useState('All years')
  const [costFilter, setCostFilter] = useState('All costs')

  const search = useMutation({
    mutationFn: () => findOpportunities(),
  })

  const exportProfile = useMutation({
    mutationFn: () => getAutofillProfile(),
    onSuccess: (profile) => {
      const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'opppilot-autofill-profile.json'
      link.click()
      URL.revokeObjectURL(url)
    },
  })

  const filteredOpportunities = (search.data ?? []).filter((opportunity) => {
    const matchesRegion = regionFilter === 'All regions' || opportunity.region === regionFilter
    const matchesYear =
      yearFilter === 'All years' ||
      opportunity.eligibleYears.includes(yearFilter as (typeof opportunity.eligibleYears)[number]) ||
      opportunity.eligibleYears.includes('All years')
    const matchesCost = costFilter === 'All costs' || opportunity.cost === costFilter
    return matchesRegion && matchesYear && matchesCost
  })

  // Put the most useful, complete results first without hiding less-complete results.
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    const completeness = (item: (typeof filteredOpportunities)[number]) =>
      Number(item.region !== 'Not specified') +
      Number(!item.eligibleYears.includes('Not specified')) +
      Number(item.cost !== 'Not specified')

    const completenessDifference = completeness(b) - completeness(a)
    if (completenessDifference !== 0) return completenessDifference
    // When completeness is equal, prefer pages whose full content was fetched.
    return Number(b.detailsChecked) - Number(a.detailsChecked)
  })

  const dueSoonOpportunities = sortedOpportunities.filter((opportunity) => {
    const daysLeft = getDeadlineDays(opportunity.deadline)
    return daysLeft !== null && daysLeft >= 0 && daysLeft <= 3
  })

  const selectClassName =
    'mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground'

  return (
    <BentoCard
      tone="mint"
      variants={riseIn}
      className={cn('flex flex-col justify-between gap-10 md:p-10', className)}
    >
      <BentoIcon tone="mint">
        <IconSparkles aria-hidden />
      </BentoIcon>
      <div>
        <h1 className="text-3xl font-bold tracking-tight break-words md:text-5xl">
          Welcome {name}
        </h1>
        <p className="mt-3 max-w-lg text-foreground/70 md:text-lg">
          Find scholarships, internships, hackathons and government schemes
          using live web results matched to your student profile.
        </p>
        <p className="mt-3 max-w-xl text-sm text-foreground/60">
          Want faster applications? Export your profile JSON, import it into the OppPilot Autofill Chrome extension, and fill matching fields on opportunity forms. You always review and submit manually.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            onClick={() => search.mutate()}
            disabled={search.isPending}
            className="h-12 rounded-full px-6 text-base font-semibold"
          >
            <IconSearch data-icon="inline-start" />
            {search.isPending ? 'Searching the web…' : 'Find opportunities'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => exportProfile.mutate()}
            disabled={exportProfile.isPending}
            className="h-12 rounded-full px-5 text-base font-semibold"
          >
            <IconDownload data-icon="inline-start" />
            {exportProfile.isPending ? 'Preparing profile…' : 'Export autofill profile'}
          </Button>
          <Badge variant="outline" className="bg-card">
            {search.isPending
              ? 'TinyFish is searching'
              : search.isSuccess
                ? `${search.data.length} found`
                : 'Live search'}
          </Badge>
        </div>

        {search.isError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {search.error instanceof Error
              ? search.error.message
              : 'Search failed. Please try again.'}
          </p>
        )}

        {search.isSuccess && dueSoonOpportunities.length > 0 && (
          <div role="alert" className="mt-5 rounded-xl border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-semibold">Deadlines coming up</p>
            <p className="mt-1">These opportunities have a deadline within the next 3 days. Confirm the date on the official source before applying.</p>
            <ul className="mt-2 space-y-1">
              {dueSoonOpportunities.map((opportunity) => (
                <li key={opportunity.url}>
                  <a href={opportunity.url} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-2">
                    {opportunity.title}
                  </a>
                  <span> — {getDeadlineLabel(opportunity.deadline)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {search.isSuccess && (
          <div className="mt-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-semibold">Opportunities found</h2>
              <p className="text-sm text-foreground/70">
                OppPilot now tries to read each opportunity page with TinyFish Fetch before classifying it. Labels are based on page text when available; if a page cannot be read or a detail is unclear, it may still show Not specified. Confirm important requirements on the source page.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-sm font-medium">
                Region
                <select
                  className={selectClassName}
                  value={regionFilter}
                  onChange={(event) => setRegionFilter(event.target.value)}
                >
                  {regionOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">
                Academic year eligibility
                <select
                  className={selectClassName}
                  value={yearFilter}
                  onChange={(event) => setYearFilter(event.target.value)}
                >
                  {yearOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">
                Cost
                <select
                  className={selectClassName}
                  value={costFilter}
                  onChange={(event) => setCostFilter(event.target.value)}
                >
                  {costOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>

            {filteredOpportunities.length === 0 ? (
              <p className="rounded-xl border border-border/70 bg-card p-4 text-sm text-foreground/70">
                No results match these filters. Try a different combination or choose “All” options.
              </p>
            ) : (
              <>
                <p className="text-xs text-foreground/50">
                  Showing {filteredOpportunities.length} of {search.data.length} results
                </p>
                <ul className="space-y-3">
                  {sortedOpportunities.map((opportunity) => (
                    <li
                      key={opportunity.url}
                      className="rounded-xl border border-border/70 bg-card p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold">{opportunity.title}</h3>
                        <Badge variant="outline">{opportunity.type}</Badge>
                      </div>
                      {opportunity.snippet && (
                        <p className="mt-2 text-sm text-foreground/70">
                          {opportunity.snippet}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant={opportunity.deadline ? 'secondary' : 'outline'}>
                          Deadline: {getDeadlineLabel(opportunity.deadline)}
                        </Badge>
                        <Badge variant="secondary">Region: {opportunity.region}</Badge>
                        <Badge variant="secondary">Year: {opportunity.eligibleYears.join(', ')}</Badge>
                        <Badge variant="secondary">Cost: {opportunity.cost}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <p className="text-xs text-foreground/50">
                          Source: {opportunity.siteName}
                        </p>
                        <Badge variant={opportunity.detailsChecked ? 'secondary' : 'outline'}>
                          {opportunity.detailsChecked ? 'Page content fetched' : 'Search result only'}
                        </Badge>
                      </div>
                      <ApplyOnOppPilot
                        title={opportunity.title}
                        url={opportunity.url}
                        type={opportunity.type}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </BentoCard>
  )
}
