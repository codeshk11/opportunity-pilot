import { Link } from '@tanstack/react-router'

import { useLoginMutation } from '../../hooks/use-login-mutation'
import { AuthPanel } from './auth-panel'
import { CredentialsForm } from './credentials-form'

export function LoginPanel() {
  const login = useLoginMutation()

  return (
    <AuthPanel
      title="Welcome back"
      description="Log in to see your matches and deadlines."
      footer={
        <>
          New to OppPilot?{' '}
          <Link
            to="/signup"
            className="font-semibold text-lavender-ink underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <CredentialsForm
        mode="login"
        submitLabel="Log in"
        pendingLabel="Logging in…"
        onSubmit={(credentials) => login.mutateAsync(credentials)}
      />
    </AuthPanel>
  )
}
