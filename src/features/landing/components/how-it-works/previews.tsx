import {
  IconAlertTriangle,
  IconBellRinging,
  IconCircleCheckFilled,
  IconClockHour4,
  IconFileText,
  IconHandFinger,
  IconPencil,
} from '@tabler/icons-react'
import { DISCOVER_SAMPLES } from '../../constants'
import type { ReactNode } from 'react'

import { OPPORTUNITY_TYPE_META } from '@/constants/opportunity-types'
import { TONE_CLASSES } from '@/constants/tones'
import { cn } from '@/lib/utils'

// =============================================================================
// Shared frame
// =============================================================================
// Decorative mini-UIs inside the feature cards. Hidden from assistive tech:
// the card copy already says what each one shows.

function PreviewPanel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'rounded-xl bg-card p-3 text-sm shadow-sm ring-1 ring-foreground/5',
        className,
      )}
    >
      {children}
    </div>
  )
}

function CheckRow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2">
      <IconCircleCheckFilled className="size-4 shrink-0 text-mint-ink" />
      {children}
    </p>
  )
}

// =============================================================================
// Previews
// =============================================================================

export function DiscoverPreview() {
  return (
    <PreviewPanel className="p-0">
      <p className="flex items-center gap-2 border-b px-4 py-2.5 text-xs text-muted-foreground">
        <span className="size-2 rounded-full bg-mint-ink" />
        Scanning official portals, college sites and job boards
      </p>
      <ul className="divide-y">
        {DISCOVER_SAMPLES.map((sample) => {
          const meta = OPPORTUNITY_TYPE_META[sample.type]
          const tone = TONE_CLASSES[meta.tone]
          return (
            <li
              key={sample.title}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg',
                  tone.surface,
                  tone.ink,
                )}
              >
                <meta.icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{sample.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {meta.label} · {sample.detail}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium max-sm:hidden">
                <IconClockHour4 className="size-3.5" />
                {sample.due}
              </span>
            </li>
          )
        })}
      </ul>
    </PreviewPanel>
  )
}

export function VerifyPreview() {
  return (
    <PreviewPanel className="space-y-2">
      <CheckRow>Official source found</CheckRow>
      <CheckRow>Deadline confirmed</CheckRow>
      <p className="flex items-center gap-2 text-peach-ink">
        <IconAlertTriangle className="size-4 shrink-0" />
        Asks for a “registration fee”: hidden
      </p>
    </PreviewPanel>
  )
}

export function MatchPreview() {
  return (
    <PreviewPanel>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold tracking-tight text-peach-ink">
          92%
        </span>
        <span className="text-xs text-muted-foreground">profile match</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-peach">
        <div
          className="h-full rounded-full bg-peach-ink"
          style={{ width: '92%' }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        {['CGPA', 'State', 'Income', 'Branch'].map((criterion) => (
          <span
            key={criterion}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"
          >
            <IconCircleCheckFilled className="size-3 text-mint-ink" />
            {criterion}
          </span>
        ))}
      </div>
    </PreviewPanel>
  )
}

export function PrepPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
      <PreviewPanel className="space-y-2">
        <CheckRow>Income certificate</CheckRow>
        <p className="flex items-center gap-2">
          <IconPencil className="size-4 shrink-0 text-sky-ink" />
          Statement of purpose drafted
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <IconFileText className="size-4 shrink-0" />
          Bonafide certificate still needed
        </p>
      </PreviewPanel>
      <p
        aria-hidden
        className="inline-flex items-center gap-2 self-start rounded-full bg-card px-3 py-2 text-xs font-medium shadow-sm sm:self-end"
      >
        <IconBellRinging className="size-4 text-sky-ink" />
        Reminder 3 days before
      </p>
    </div>
  )
}

export function SubmitPreview() {
  return (
    <PreviewPanel className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="font-medium">Application ready</p>
        <p className="text-xs text-muted-foreground">
          Reviewed by you. Waiting for your click.
        </p>
      </div>
      <span className="relative inline-flex shrink-0 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Submit
        <IconHandFinger className="absolute -right-2 -bottom-4 size-7 -rotate-12 fill-card text-foreground" />
      </span>
    </PreviewPanel>
  )
}
