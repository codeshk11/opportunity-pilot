import { IconSearch, IconSparkles } from '@tabler/icons-react'

import { BentoCard, BentoIcon } from '@/components/shared/bento-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WelcomeCard({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <BentoCard
      tone="mint"
      delay={80}
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
          Your profile is ready. Soon OppPilot will search the web for
          opportunities that fit it, and check each one before it reaches you.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            disabled
            className="h-12 rounded-full px-6 text-base font-semibold"
          >
            <IconSearch data-icon="inline-start" />
            Find opportunities
          </Button>
          <Badge variant="outline" className="bg-card">
            Coming soon
          </Badge>
        </div>
      </div>
    </BentoCard>
  )
}
