import { useEffect, useState } from 'react'
import { IconCircleCheck, IconLoader2, IconMailX } from '@tabler/icons-react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { BentoCard } from '@/components/shared/bento-card'
import { profileQueryOptions } from '@/features/profile/hooks/query-options'
import { profileDestination } from '@/features/profile/utils/profile-destination'
import { supabase } from '@/integrations/supabase/client'
import useAuthStore from '@/store/auth-store'

export const Route = createFileRoute('/auth/callback')({
  ssr: false,
  component: EmailVerificationCallback,
})

function EmailVerificationCallback() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const [verified, setVerified] = useState(false)
  const [checking, setChecking] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.hash.slice(1))
    const description = params.get('error_description')
    const code = params.get('error_code')
    return description
      ? decodeURIComponent(description.replace(/\+/g, ' '))
      : code
        ? 'This verification link is invalid or has expired. Request a new email and try again.'
        : null
  })

  useEffect(() => {
    let active = true

    const syncSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!active) return
        const user = data.session?.user ?? null
        setUser(user)
        if (user?.email_confirmed_at) {
          setVerified(true)
          setErrorMessage(null)
        } else if (!user) {
          setErrorMessage((current) => current ?? 'We could not confirm this session. The link may have expired, or the email redirect settings may need updating.')
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Verification could not be completed. Please try again.')
        }
      } finally {
        if (active) setChecking(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setUser(user)
      if (user?.email_confirmed_at) {
        setVerified(true)
        setErrorMessage(null)
        setChecking(false)
      }
    })

    void syncSession()
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [setUser])

  const continueToOppPilot = async () => {
    try {
      const profile = await queryClient.fetchQuery(profileQueryOptions)
      await router.navigate({ to: profileDestination(profile), replace: true })
    } catch {
      // A verified account can still continue; protected routes will send
      // the student to login if the session is no longer available.
      await router.navigate({ to: '/dashboard', replace: true })
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <BentoCard interactive={false} className="w-full max-w-lg p-8 text-center md:p-10">
        <div
          className={`mx-auto mb-6 grid size-16 place-items-center rounded-2xl ${verified ? 'bg-emerald-100 text-emerald-700' : errorMessage ? 'bg-rose-100 text-rose-700' : 'bg-muted text-muted-foreground'}`}
        >
          {verified ? <IconCircleCheck className="size-8" aria-hidden /> : errorMessage ? <IconMailX className="size-8" aria-hidden /> : <IconLoader2 className="size-8 animate-spin" aria-hidden />}
        </div>

        <p className={`mb-2 text-sm font-semibold uppercase tracking-[0.16em] ${verified ? 'text-emerald-700' : 'text-muted-foreground'}`}>
          {verified ? 'Email verified' : errorMessage ? 'Verification needs attention' : 'Checking your email'}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {verified ? 'You’re all set!' : errorMessage ? 'We couldn’t verify this link' : 'Confirming your email…'}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
          {verified
            ? 'Your email address is verified. Continue to OppPilot and finish setting up your account.'
            : errorMessage ?? 'Please wait while OppPilot checks the verification link.'}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {verified ? (
            <Button
              size="lg"
              className="h-12 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void continueToOppPilot()}
            >
              Continue to OppPilot
            </Button>
          ) : errorMessage && !checking ? (
            <Button size="lg" className="h-12 rounded-full" render={<Link to="/login" />} nativeButton={false}>
              Go to log in
            </Button>
          ) : (
            <Button size="lg" className="h-12 rounded-full" disabled>
              Verifying…
            </Button>
          )}
          <a
            href="https://opportunity-pilot.vercel.app"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Open OppPilot
          </a>
        </div>
      </BentoCard>
    </main>
  )
}
