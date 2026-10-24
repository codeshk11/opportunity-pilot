import { IconMailOpened } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { useSignupMutation } from '../../hooks/use-signup-mutation'
import { AuthPanel } from './auth-panel'
import { CredentialsForm } from './credentials-form'
import { Button } from '@/components/ui/button'

export function SignupPanel() {
  const signup = useSignupMutation()

  // Signed up, but the project wants the email confirmed before a session.
  if (signup.isSuccess && !signup.data.session) {
    return (
      <AuthPanel
        title="Check your inbox"
        description={`We sent a confirmation link to ${signup.variables.email}. Open it on this device, then you can set up your profile.`}
      >
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-mint p-8 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-card text-mint-ink shadow-sm">
            <IconMailOpened className="size-7" aria-hidden />
          </span>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full bg-card px-5"
            render={<Link to="/login" />}
            nativeButton={false}
          >
            Back to log in
          </Button>
        </div>
      </AuthPanel>
    )
  }

  return (
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
        onSubmit={(credentials) => signup.mutateAsync(credentials)}
      />
    </AuthPanel>
  )
}
