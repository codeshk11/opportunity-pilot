import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AccountHeader } from '@/components/account-header';
import { supabase } from '@/integrations/supabase/client';
import { credentialSchema, profileDestination } from '@/lib/profile-schema';

export const Route = createFileRoute('/auth')({
  ssr: false,
  head: () => ({ meta: [{ title: 'Sign up or log in — OppPilot' }, { name: 'description', content: 'Create your OppPilot student account or sign in to your opportunities dashboard.' }, { property: 'og:title', content: 'Your OppPilot account' }, { property: 'og:description', content: 'Sign up or log in to OppPilot.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { data: profile, error } = await supabase.from('profiles').select('completed_at').eq('user_id', data.user.id).maybeSingle();
    if (error) throw new Error('Your profile could not be loaded. Please try again.');
    throw redirect({ to: profileDestination(profile) });
  },
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const navigate = useNavigate();
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    const parsed = credentialSchema.safeParse({ email, password });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check your details.'); return; }
    setBusy(true);
    try {
      const result = mode === 'signup' ? await supabase.auth.signUp({ ...parsed.data, options: { emailRedirectTo: window.location.origin } }) : await supabase.auth.signInWithPassword(parsed.data);
      if (result.error) { setError(result.error.message); return; }
      if (!result.data.session) { setConfirmation(true); return; }
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('Please confirm your email before signing in.');
      const { data: profile, error: profileError } = await supabase.from('profiles').select('completed_at').eq('user_id', userData.user.id).maybeSingle();
      if (profileError) throw new Error('Your profile could not be loaded. Please try again.');
      await navigate({ to: profileDestination(profile), replace: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen"><AccountHeader /><section className="mx-auto max-w-xl px-6 pb-16 pt-8"><div className="mb-8 text-center"><span className="rounded-full bg-lavender px-4 py-1 text-sm">Your next chapter starts here</span><h1 className="mt-5 text-3xl font-bold">{confirmation ? 'Check your inbox' : mode === 'signup' ? 'Join OppPilot' : 'Welcome back'}</h1></div>
    <div className="rounded-2xl bg-mint p-6 shadow-sm md:p-9 fade-up">{confirmation ? <div className="text-center"><Mail className="mx-auto mb-4 h-10 w-10 text-primary" /><p>Confirm your email using the link in your inbox, then sign in to complete your profile.</p><Button className="mt-6" onClick={() => { setConfirmation(false); setMode('login'); setPassword(''); }}>Back to sign in</Button></div> : <><div className="mb-7 grid grid-cols-2 gap-2 rounded-xl bg-card p-1" role="tablist" aria-label="Account mode">{(['signup', 'login'] as const).map(item => <Button key={item} role="tab" aria-selected={mode === item} variant={mode === item ? 'default' : 'ghost'} onClick={() => { setMode(item); setError(''); }}>{item === 'signup' ? 'Sign up' : 'Log in'}</Button>)}</div>
    <form onSubmit={submit} className="space-y-5"><label className="block text-sm font-medium" htmlFor="email">Email<Input id="email" type="email" autoComplete="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} className="mt-2 h-12 bg-card" /></label><div><label htmlFor="password" className="text-sm font-medium">Password</label><div className="relative mt-2"><Input id="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={8} maxLength={128} required value={password} onChange={e => setPassword(e.target.value)} className="h-12 bg-card pr-12" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1.5" aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</Button></div></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy} className="btn-pop h-12 w-full rounded-full">{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}<ArrowRight /></Button></form></>}</div>
  </section></main>;
}