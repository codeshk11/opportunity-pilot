import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IconExternalLink, IconRefresh, IconTimeline } from '@tabler/icons-react'

import { BentoCard } from '@/components/shared/bento-card'
import { Button } from '@/components/ui/button'
import { getMyApplications } from '@/features/dashboard/api/get-my-applications'
import { updateApplicationStatus } from '@/features/dashboard/api/update-application-status'

const statusOptions = [
  { value: 'saved_in_opppilot', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'result', label: 'Result received' },
] as const

function labelForStatus(status: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? 'Saved'
}

function daysSince(value: string) {
  const timestamp = new Date(value).getTime()
  if (!Number.isFinite(timestamp)) return 0
  return Math.floor((Date.now() - timestamp) / 86_400_000)
}

export function ApplicationsTracker({ className }: { className?: string }) {
  const queryClient = useQueryClient()
  const applications = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => getMyApplications(),
  })
  const updateStatus = useMutation({
    mutationFn: (input: { id: string; status: 'saved_in_opppilot' | 'applied' | 'waiting' | 'result' }) =>
      updateApplicationStatus({ data: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-applications'] }),
  })

  return (
    <BentoCard tone="lavender" className={className}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 grid size-10 place-items-center rounded-xl bg-lavender text-lavender-ink">
            <IconTimeline aria-hidden className="size-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">My Applications</h2>
          <p className="mt-1 text-sm text-foreground/65">You control each status. OppPilot never marks an application as approved or submitted for you.</p>
        </div>
        <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => void applications.refetch()} disabled={applications.isFetching}>
          <IconRefresh data-icon="inline-start" /> Refresh
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {statusOptions.map((status) => (
          <div key={status.value} className="rounded-xl border border-border/70 bg-card/70 p-3">
            <p className="text-xs text-foreground/60">{status.label}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {(applications.data ?? []).filter((application) => application.status === status.value || (status.value === 'saved_in_opppilot' && !['applied', 'waiting', 'result'].includes(application.status))).length}
            </p>
          </div>
        ))}
      </div>

      {applications.isPending && <p className="mt-4 text-sm text-foreground/60">Loading your saved applications…</p>}
      {applications.isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">
          {applications.error instanceof Error ? applications.error.message : 'Could not load applications.'}
        </div>
      )}
      {updateStatus.isError && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {updateStatus.error instanceof Error ? updateStatus.error.message : 'Could not update status.'}
        </p>
      )}
      {applications.isSuccess && applications.data.length === 0 && (
        <p className="mt-4 rounded-xl border border-border/70 bg-card/70 p-4 text-sm text-foreground/65">
          Your tracker is empty. Use “Track / prepare application” on an opportunity and save it here first.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {(applications.data ?? []).map((application) => {
          const waitingDays = daysSince(application.status_updated_at || application.created_at)
          const needsNudge = application.status === 'waiting' && waitingDays >= 14
          return (
            <li key={application.id} className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-semibold">{application.opportunity_title}</h3>
                  <p className="mt-1 text-xs text-foreground/55">{application.opportunity_type || 'Opportunity'} · Saved {new Date(application.created_at).toLocaleDateString()}</p>
                </div>
                <a href={application.opportunity_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline underline-offset-2">
                  Official page <IconExternalLink aria-hidden className="size-4" />
                </a>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Status</span>
                  <select
                    aria-label={`Status for ${application.opportunity_title}`}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                    value={statusOptions.some((option) => option.value === application.status) ? application.status : 'saved_in_opppilot'}
                    disabled={updateStatus.isPending}
                    onChange={(event) => updateStatus.mutate({ id: application.id, status: event.target.value as 'saved_in_opppilot' | 'applied' | 'waiting' | 'result' })}
                  >
                    {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <span className="text-xs text-foreground/55">Current stage: {labelForStatus(application.status)}</span>
              </div>

              {needsNudge && (
                <div role="alert" className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
                  <p className="font-semibold">No update for 14 days</p>
                  <p className="mt-1">Check the official page or your email for an update. If there is still no response, consider moving on. This is a reminder, not a prediction of the result.</p>
                  <a href={application.opportunity_url} target="_blank" rel="noreferrer" className="mt-2 inline-block font-medium underline underline-offset-2">Check official page</a>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-foreground/50">The 14-day reminder is based on how long the item has stayed in Waiting. Changing its status resets the waiting timer. Notifications currently appear in this tracker when you open or refresh the dashboard; they are not push or email alerts.</p>
    </BentoCard>
  )
}
