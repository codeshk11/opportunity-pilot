import { IconArrowNarrowLeft, IconMapQuestion } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { StatusView } from './status-view'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <StatusView
      icon={<IconMapQuestion />}
      title="Page not found"
      description="The page you are looking for doesn't exist or has moved."
    >
      <Button
        size="lg"
        className="btn-pop rounded-full px-5"
        render={<Link to="/" />}
        nativeButton={false}
      >
        <IconArrowNarrowLeft data-icon="inline-start" />
        Back to home
      </Button>
    </StatusView>
  )
}
