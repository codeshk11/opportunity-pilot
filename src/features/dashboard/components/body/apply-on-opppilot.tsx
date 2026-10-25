import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { IconCheck, IconClipboardList, IconExternalLink } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveOppPilotApplication } from '@/features/dashboard/api/save-opppilot-application'
import { getAutofillProfile } from '@/features/dashboard/api/get-autofill-profile'

type Props = { title: string; url: string; type: string }

export function ApplyOnOppPilot({ title, url, type }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [motivation, setMotivation] = useState('')
  const [profileDetails, setProfileDetails] = useState({
    college: '',
    branch: '',
    year: '',
    state: '',
    category: '',
    cgpa: '',
    skills: '',
    interests: '',
  })
  const save = useMutation({
    mutationFn: () => saveOppPilotApplication({ data: { title, url, type, name, email, phone, motivation } }),
  })
  const autofill = useMutation({
    mutationFn: () => getAutofillProfile(),
    onSuccess: (profile) => {
      setName((current) => current || profile.name)
      setEmail((current) => current || profile.email)
      setProfileDetails({
        college: profile.college || '',
        branch: profile.branch || '',
        year: profile.year || '',
        state: profile.state || '',
        category: profile.category || '',
        cgpa: profile.cgpa || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : String(profile.skills || ''),
        interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : String(profile.interests || ''),
      })
    },
  })

  if (save.isSuccess) {
    return (
      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="flex items-center gap-2 font-semibold"><IconCheck aria-hidden className="size-4" /> Saved to My Applications</p>
        <p className="mt-1">This saves a tracker entry in OppPilot. It does not submit anything to the organiser.</p>
        <a className="mt-3 inline-flex items-center gap-2 font-medium underline underline-offset-2" href={url} target="_blank" rel="noreferrer">
          Open official opportunity page <IconExternalLink aria-hidden className="size-4" />
        </a>
      </div>
    )
  }

  return (
    <div className="mt-3">
      <Button type="button" onClick={() => { const nextOpen = !open; setOpen(nextOpen); if (nextOpen) autofill.mutate() }} variant="default" className="rounded-full">
        <IconClipboardList data-icon="inline-start" />
        {open ? 'Close application form' : 'Track / prepare application'}
      </Button>
      {open && (
        <form className="mt-3 space-y-3 rounded-xl border border-border bg-background p-4" onSubmit={(event) => { event.preventDefault(); save.mutate() }}>
          <div>
            <h4 className="font-semibold">Your application details</h4>
            <p className="mt-1 text-xs text-foreground/60">{autofill.isPending ? 'Loading your saved profile…' : 'Details are filled from your registered profile when available. Check them before saving.'}</p>
          </div>
          {autofill.isError && <p role="status" className="text-xs text-foreground/60">Could not autofill your profile; you can enter your details manually.</p>}
          <label className="block text-sm font-medium">Full name
            <Input required maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1" />
          </label>
          <label className="block text-sm font-medium">Email
            <Input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1" />
          </label>
          <label className="block text-sm font-medium">Phone (optional)
            <Input type="tel" maxLength={40} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1" />
          </label>
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
            <h5 className="font-semibold">Academic profile (from your account)</h5>
            <p className="mt-1 text-xs text-foreground/60">Review these saved details. OppPilot never sends an application without your action, and it does not press the organiser's final Submit button.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium">College / University
                <Input value={profileDetails.college} readOnly placeholder="Add college in your profile" className="mt-1" />
              </label>
              <label className="block text-sm font-medium">Branch / Major
                <Input value={profileDetails.branch} readOnly placeholder="Add branch in your profile" className="mt-1" />
              </label>
              <label className="block text-sm font-medium">Current year
                <Input value={profileDetails.year} readOnly placeholder="Add study year in your profile" className="mt-1" />
              </label>
              <label className="block text-sm font-medium">State
                <Input value={profileDetails.state} readOnly placeholder="Add state in your profile" className="mt-1" />
              </label>
              <label className="block text-sm font-medium">CGPA
                <Input value={profileDetails.cgpa} readOnly placeholder="Not provided" className="mt-1" />
              </label>
              <label className="block text-sm font-medium">Category (if relevant)
                <Input value={profileDetails.category} readOnly placeholder="Not provided" className="mt-1" />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">Skills
                <Input value={profileDetails.skills} readOnly placeholder="Add skills in your profile" className="mt-1" />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">Interests
                <Input value={profileDetails.interests} readOnly placeholder="Add interests in your profile" className="mt-1" />
              </label>
            </div>
          </div>
          <label className="block text-sm font-medium">Why are you interested? (optional)
            <Textarea maxLength={3000} value={motivation} onChange={(event) => setMotivation(event.target.value)} className="mt-1" rows={3} />
          </label>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
            <p className="font-semibold">Student approval required</p>
            <p className="mt-1">OppPilot can save your tracker entry and open the official page. Only you decide whether to apply, what to submit, and when to press Submit on the organiser's website. The agent cannot approve or submit on your behalf.</p>
          </div>
          {save.isError && <p role="alert" className="text-sm text-destructive">{save.error instanceof Error ? save.error.message : 'Could not save this application. Please try again.'}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="default" disabled={save.isPending} className="rounded-full">{save.isPending ? 'Saving…' : 'Save to My Applications'}</Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
              <IconExternalLink data-icon="inline-start" /> Open official page
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
