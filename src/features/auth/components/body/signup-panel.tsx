import { IconMailOpened } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, m } from 'motion/react'

import { useSignupMutation } from '../../hooks/use-signup-mutation'
import { AuthPanel } from './auth-panel'
import { CredentialsForm } from './credentials-form'
import type { Variants } from 'motion/react'
import { Button } from '@/components/ui/button'
import { EASE_OUT, popIn } from '@/lib/motion'

// Cross-fades the form into the check-your-inbox state, with a short blur
// that hides the swap.
const swap = {
  hidden: { opacity: 0, filter: 'blur(6px)', scale: 0.98 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.35, ease: EASE_OUT, delayChildren: 0.15 },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.98,
    transition: { duration: 0.15, ease: EASE_OUT },
  },
} satisfies Variants

export function SignupPanel() {
  const signup = useSignupMutation()
  // Signed up, but the project wants the email confirmed before a session.
  const isAwaitingConfirmation = signup.isSuccess && !signup.data.session

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={isAwaitingConfirmation ? 'inbox' : 'form'}
        variants={swap}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {isAwaitingConfirmation ? (
          <AuthPanel
            title="Check your inbox"
            description={`We sent a confirmation link to ${signup.variables.email}. Open it on this device, then you can set up your profile.`}
          >
            <div className="flex flex-col items-center gap-6 rounded-2xl bg-mint p-8 text-center">
              <m.span
                variants={popIn}
                className="grid size-14 place-items-center rounded-2xl bg-card text-mint-ink shadow-sm"
              >
                <IconMailOpened className="size-7" aria-hidden />
              </m.span>
              <Button
                variant="outline"
                size="lg"
                className="h-11 rounded-full bg-card px-5"
                render={<Link to="/login" />}
                nativeButton={false}
              >
                Back to log in
              </Button>
            </div>
          </AuthPanel>
        ) : (
          <AuthPanel
            title="Create your account"
            description="Two minutes to set up. Then OppPilot starts looking for you."
            footer={
              <>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-lavender-ink underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </>
            }
          >
            <CredentialsForm
              mode="signup"
              submitLabel="Create account"
              pendingLabel="Creating account…"
              onSubmit={(credentials) => signup.mutateAsync(credentials)}
            />
          </AuthPanel>
        )}
      </m.div>
    </AnimatePresence>
  )
}
