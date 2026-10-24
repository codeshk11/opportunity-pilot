import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { Sparkles, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from './account-context';

export function AccountHeader() {
  const { user, loading } = useAccount();
  const router = useRouter();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    await router.options.context.queryClient.cancelQueries();
    router.options.context.queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) { setError('Could not sign out. Please try again.'); setBusy(false); return; }
    await navigate({ to: '/auth', replace: true });
    setBusy(false);
  }
  return <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 fade-up">
    <Link to="/" className="flex items-center gap-2 text-lg font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>OppPilot</Link>
    {!loading && (user ? <div className="flex items-center gap-2"><Button asChild variant="ghost"><Link to="/dashboard">My dashboard</Link></Button><Button variant="secondary" disabled={busy} onClick={signOut}><LogOut />Sign out</Button></div> : <Button asChild variant="secondary" className="btn-pop rounded-full"><Link to="/auth">Sign in</Link></Button>)}
    {error && <p role="alert" className="w-full text-sm text-destructive">{error}</p>}
  </header>;
}