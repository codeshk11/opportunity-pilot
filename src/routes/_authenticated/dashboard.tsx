import { createFileRoute, redirect } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Search, Sparkles } from 'lucide-react';
import { AccountHeader } from '@/components/account-header';
import { Button } from '@/components/ui/button';
import { profileQueryOptions } from '@/lib/profiles.functions';
import { profileDestination } from '@/lib/profile-schema';

export const Route = createFileRoute('/_authenticated/dashboard')({
  head: () => ({ meta: [{ title: 'Your dashboard — OppPilot' }, { name: 'description', content: 'Your personal OppPilot student opportunity dashboard.' }, { property: 'og:title', content: 'OppPilot dashboard' }, { property: 'og:description', content: 'Your personal student opportunity dashboard.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  loader: async ({ context }) => {
    const profile = await context.queryClient.ensureQueryData(profileQueryOptions);
    if (profileDestination(profile) === '/onboarding') throw redirect({ to: '/onboarding' });
  },
  component: Dashboard,
});
function Dashboard() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions);
  return <main className="min-h-screen"><AccountHeader /><section className="mx-auto max-w-6xl px-6 py-10"><article className="card-soft fade-up max-w-3xl bg-mint p-8 md:p-12"><Sparkles className="mb-8 h-10 w-10 text-primary" /><h1 className="break-words text-3xl font-bold md:text-4xl">Welcome {profile?.name}</h1><Button disabled className="mt-8 h-12 rounded-full px-6"><Search />Find opportunities</Button></article></section></main>;
}