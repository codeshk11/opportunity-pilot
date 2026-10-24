import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { IconSearch, IconSparkles, IconExternalLink } from '@tabler/icons-react'

import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { findOpportunities } from '@/features/dashboard/api/find-opportunities'
import { riseIn } from '@/lib/motion'
import { cn } from '@/lib/utils'

const regionOptions = ['All regions', 'Your state', 'Across India', 'International', 'Not specified']
const yearOptions = ['All years', '1st year', '2nd year', 'Other years', 'Not specified']
const costOptions = ['All costs', 'Free', 'Paid', 'Not specified']

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

  const filteredOpportunities = (search.data ?? []).filter((opportunity) => {
    const matchesRegion = regionFilter === 'All regions' || opportunity.region === regionFilter
    const matchesYear =
      yearFilter === 'All years' ||
      opportunity.eligibleYears.includes(yearFilter as (typeof opportunity.eligibleYears)[number]) ||
      opportunity.eligibleYears.includes('All years')
    const matchesCost = costFilter === 'All costs' || opportunity.cost === costFilter
    return matchesRegion && matchesYear && matchesCost
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
                  {filteredOpportunities.map((opportunity) => (
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
                      <a
                        href={opportunity.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
                      >
                        Open source page
                        <IconExternalLink aria-hidden className="size-4" />
                      </a>
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
