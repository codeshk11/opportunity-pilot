import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, GraduationCap, Heart, ShieldCheck, X, Plus } from 'lucide-react';
import { AccountHeader } from '@/components/account-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { profileQueryOptions, saveProfile } from '@/lib/profiles.functions';
import { academicSchema, backgroundSchema, preferencesSchema, profileSchema, profileDestination, years, categories, incomeRanges, interests } from '@/lib/profile-schema';

export const Route = createFileRoute('/_authenticated/onboarding')({
  head: () => ({ meta: [{ title: 'Set up your student profile — OppPilot' }, { name: 'description', content: 'Tell OppPilot about your studies, background, interests and skills.' }, { property: 'og:title', content: 'Your OppPilot student profile' }, { property: 'og:description', content: 'Set up your profile in three friendly steps.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  loader: async ({ context }) => {
    const profile = await context.queryClient.ensureQueryData(profileQueryOptions);
    if (profileDestination(profile) === '/dashboard') throw redirect({ to: '/dashboard' });
  },
  component: Onboarding,
});

const states = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'];
const steps = [{ name: 'Your campus', icon: GraduationCap, color: 'bg-mint' }, { name: 'Your background', icon: ShieldCheck, color: 'bg-peach' }, { name: 'Your ambitions', icon: Heart, color: 'bg-sky' }];
function Onboarding() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: profile?.name ?? '', college: profile?.college ?? '', branch: profile?.branch ?? '', year: profile?.year ?? '', state: profile?.state ?? '', category: profile?.category ?? '', family_income_range: profile?.family_income_range ?? '', cgpa: profile?.cgpa?.toString() ?? '', interests: profile?.interests ?? [], skills: profile?.skills ?? [] });
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const save = useServerFn(saveProfile);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  function update(key: 'name' | 'college' | 'branch' | 'year' | 'state' | 'category' | 'family_income_range' | 'cgpa', value: string) { setValues(v => ({ ...v, [key]: value })); }
  function addTag() {
    const skill = tag.trim();
    if (!skill) return values.skills;
    if (skill.length > 50 || values.skills.length >= 30) { setError('Use up to 30 skills, with 50 characters per skill.'); return null; }
    const next = values.skills.some(s => s.toLowerCase() === skill.toLowerCase()) ? values.skills : [...values.skills, skill];
    setValues(v => ({ ...v, skills: next })); setTag(''); setError(''); return next;
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    const skills = step === 2 ? addTag() : values.skills;
    if (!skills) return;
    const input = { ...values, skills, cgpa: values.cgpa.trim() === '' ? undefined : Number(values.cgpa) };
    const schema = step === 0 ? academicSchema : step === 1 ? backgroundSchema : preferencesSchema;
    const checked = schema.safeParse(input);
    if (!checked.success) { const issue = checked.error.issues[0]; setError(`${issue?.path[0]?.toString().replaceAll('_', ' ') ?? 'Details'}: ${issue?.message ?? 'Please check this field.'}`); return; }
    if (step < 2) { setStep(step + 1); return; }
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) { setError('Please check the details in the previous steps.'); return; }
    setBusy(true);
    try { await save({ data: parsed.data }); await queryClient.invalidateQueries({ queryKey: ['student-profile'] }); await navigate({ to: '/dashboard', replace: true }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Your profile could not be saved.'); }
    finally { setBusy(false); }
  }
  function textField(key: 'name' | 'college' | 'branch' | 'cgpa', label: string, placeholder: string) {
    return <label key={key} htmlFor={key} className="block text-sm font-medium">{label}<Input id={key} value={values[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} required type={key === 'cgpa' ? 'number' : 'text'} min={key === 'cgpa' ? 0 : undefined} max={key === 'cgpa' ? 10 : undefined} step={key === 'cgpa' ? '0.01' : undefined} maxLength={key === 'college' ? 200 : 100} className="mt-2 h-12 bg-card" /></label>;
  }
  function selectField(key: 'year' | 'state' | 'category' | 'family_income_range', label: string, choices: readonly string[]) {
    return <label key={key} htmlFor={key} className="block min-w-0 text-sm font-medium">{label}<select id={key} required value={values[key]} onChange={e => update(key, e.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"><option value="">Select {label.toLowerCase()}</option>{choices.map(c => <option key={c} value={c}>{c}</option>)}</select></label>;
  }
  return <main className="min-h-screen"><AccountHeader /><section className="mx-auto max-w-5xl px-6 pb-16 pt-5"><div className="mb-8"><span className="rounded-full bg-lavender px-4 py-1 text-sm">A little about you</span><h1 className="mt-5 text-3xl font-bold md:text-4xl">Let’s meet your future.</h1></div>
    <div className="mb-8"><div className="mb-3 flex items-center justify-between text-sm"><span>{steps[step]?.name}</span><span>Step {step + 1} of 3</span></div><div role="progressbar" aria-label="Profile progress" aria-valuenow={step + 1} aria-valuemin={0} aria-valuemax={3} className="grid h-2 grid-cols-3 gap-2">{steps.map((s, i) => <div key={s.name} className={`rounded-full ${i <= step ? 'bg-primary' : 'bg-secondary'}`} />)}</div></div>
    <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]"><aside className="grid grid-cols-3 gap-2 self-start md:grid-cols-1 md:gap-4">{steps.map((s, i) => <div key={s.name} className={`rounded-2xl p-3 md:p-5 ${s.color} ${i === step ? 'ring-2 ring-primary' : ''}`}><s.icon className="mb-2 h-6 w-6 text-primary" /><span className="text-xs font-medium md:text-sm">{i + 1}. {s.name}</span>{i < step && <Check className="mt-2 h-4 w-4" />}</div>)}</aside>
    <form onSubmit={submit} className={`min-w-0 rounded-2xl p-6 shadow-sm md:p-8 ${steps[step]?.color}`}><h2 className="mb-6 text-2xl font-bold">{step === 0 ? 'Hello, campus explorer' : step === 1 ? 'The details that matter' : 'What’s on your horizon?'}</h2>
    {step === 0 && <div className="grid gap-5 sm:grid-cols-2">{textField('name', 'Name', 'Your full name')}{textField('college', 'College', 'Your college or university')}{textField('branch', 'Branch', 'e.g. Computer Science')}{selectField('year', 'Year', years)}<div className="sm:col-span-2">{selectField('state', 'State', states)}</div></div>}
    {step === 1 && <div className="grid gap-5 sm:grid-cols-2">{selectField('category', 'Category', categories)}{selectField('family_income_range', 'Annual family income', incomeRanges)}{textField('cgpa', 'CGPA (out of 10)', 'e.g. 8.5')}</div>}
    {step === 2 && <div className="space-y-7"><fieldset><legend className="mb-3 text-sm font-medium">Interests</legend><div className="flex flex-wrap gap-3">{interests.map(interest => <Button key={interest} type="button" aria-pressed={values.interests.includes(interest)} variant={values.interests.includes(interest) ? 'default' : 'outline'} className="h-11 rounded-full capitalize" onClick={() => setValues(v => ({ ...v, interests: v.interests.includes(interest) ? v.interests.filter(i => i !== interest) : [...v.interests, interest] }))}>{values.interests.includes(interest) && <Check />}{interest}</Button>)}</div></fieldset>
      <div><label htmlFor="skills" className="text-sm font-medium">Skills <span className="font-normal text-muted-foreground">(optional)</span></label><div className="mt-2 flex gap-2"><Input id="skills" placeholder="e.g. Python, writing, design" value={tag} maxLength={50} className="h-12 bg-card" onChange={e => setTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }} /><Button type="button" size="icon" className="h-12 w-12 shrink-0" aria-label="Add skill" title="Add skill" onClick={addTag}><Plus /></Button></div><div className="mt-3 flex flex-wrap gap-2">{values.skills.map(skill => <span key={skill} className="flex max-w-full items-center gap-1 rounded-full bg-card py-1 pl-3 pr-1 text-sm"><span className="break-all">{skill}</span><Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label={`Remove ${skill}`} title={`Remove ${skill}`} onClick={() => setValues(v => ({ ...v, skills: v.skills.filter(s => s !== skill) }))}><X /></Button></span>)}</div></div></div>}
    {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}<div className="mt-8 flex flex-wrap justify-between gap-3">{step > 0 ? <Button type="button" variant="outline" disabled={busy} onClick={() => { setStep(step - 1); setError(''); }}><ArrowLeft />Back</Button> : <span />}<Button type="submit" disabled={busy} className="btn-pop h-11 rounded-full px-6">{busy ? 'Saving…' : step === 2 ? 'Save my profile' : 'Continue'}{step === 2 ? <Check /> : <ArrowRight />}</Button></div>
    </form></div></section></main>;
}