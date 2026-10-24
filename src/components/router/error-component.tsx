import { IconRefresh, IconRotateClockwise2 } from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'
import { StatusView } from './status-view'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter()
  const message = error instanceof Error ? error.message : undefined

  return (
    <StatusView
      icon={<IconRefresh />}
      title="This page didn't load"
      description="Something went wrong on our end. Try again, or head back home."
    >
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          size="lg"
          className="btn-pop rounded-full px-5"
          onClick={() => {
            void router.invalidate()
            reset()
          }}
        >
          Try again
          <IconRotateClockwise2 data-icon="inline-end" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-5"
          render={<a href="/" />}
          nativeButton={false}
        >
          Go home
        </Button>
      </div>
      {message ? (
        <p className="mt-6 rounded-lg bg-card/70 p-3 font-mono text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </StatusView>
  )
}
