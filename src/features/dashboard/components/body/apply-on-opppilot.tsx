import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { IconCheck, IconClipboardList } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveOppPilotApplication } from '@/features/dashboard/api/save-opppilot-application'
import { getAutofillProfile } from '@/features/dashboard/api/get-autofill-profile'
import { submitOppPilotApplication } from '@/features/dashboard/api/submit-opppilot-application'

type Props = { title: string; url: string; type: string }

export function ApplyOnOppPilot({ title, url, type }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [motivation, setMotivation] = useState('')
  const save = useMutation({
    mutationFn: () => saveOppPilotApplication({ data: { title, url, type, name, email, phone, motivation } }),
  })
  const submit = useMutation({
    mutationFn: () => submitOppPilotApplication({ data: { title, url, type, name, email, phone, motivation } }),
  })
  const autofill = useMutation({
    mutationFn: () => getAutofillProfile(),
    onSuccess: (profile) => {
      setName((current) => current || profile.name)
      setEmail((current) => current || profile.email)
    },
  })

  if (submit.isSuccess && submit.data.submitted) {
    return (
      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="flex items-center gap-2 font-semibold"><IconCheck aria-hidden className="size-4" /> Submission confirmed by organiser website</p>
        <p className="mt-1">{submit.data.confirmationMessage || submit.data.summary}</p>
        {submit.data.finalUrl && <a className="mt-2 inline-block underline" href={submit.data.finalUrl} target="_blank" rel="noreferrer">View application page</a>}
      </div>
    )
  }

  if (save.isSuccess) {
    return (
      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="flex items-center gap-2 font-semibold"><IconCheck aria-hidden className="size-4" /> Saved to My Applications</p>
        <p className="mt-1">Your details are saved in OppPilot. This alone is not an official submission to the organiser.</p>
        <div className="mt-3 rounded-lg border border-border bg-background p-3">
          <p className="font-medium">Submit to the organiser</p>
          <p className="mt-1">OppPilot can use TinyFish to try the official application page with your details. If the site asks for a missing document, login, CAPTCHA, payment, or information you have not provided, the workflow will stop.</p>
          {submit.isError && <p role="alert" className="mt-2 text-sm text-destructive">{submit.error instanceof Error ? submit.error.message : 'Could not submit. Please use the official page.'}</p>}
          {submit.isSuccess && !submit.data.submitted && (
            <div role="status" className="mt-2 text-sm">
              <p className="font-medium">{submit.data.status === 'blocked' ? 'Official application link needed' : 'Not confirmed as submitted'}</p>
              <p className="mt-1">{submit.data.summary}</p>
              {submit.data.missingFields.length > 0 && <p className="mt-1">Still needed: {submit.data.missingFields.join(', ')}</p>}
              {submit.data.finalUrl && <a className="mt-2 inline-block underline" href={submit.data.finalUrl} target="_blank" rel="noreferrer">{submit.data.status === 'blocked' ? 'Open source post' : 'Continue on official website'}</a>}
            </div>
          )}
          <Button type="button" className="mt-3 rounded-full" disabled={submit.isPending} onClick={() => {
            const confirmed = window.confirm('Send your application details to the organiser for "' + title + '"? OppPilot will report success only if the website confirms submission.')
            if (confirmed) submit.mutate()
          }}>{submit.isPending ? 'Working on official form…' : 'Review & submit to organiser'}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3">
      <Button type="button" onClick={() => { const nextOpen = !open; setOpen(nextOpen); if (nextOpen) autofill.mutate() }} variant="default" className="rounded-full">
        <IconClipboardList data-icon="inline-start" />
        {open ? 'Close application form' : 'Apply on OppPilot'}
      </Button>
      {open && (
        <form className="mt-3 space-y-3 rounded-xl border border-border bg-background p-4" onSubmit={(event) => { event.preventDefault(); save.mutate() }}>
          <div>
            <h4 className="font-semibold">Your application details</h4>
            <p className="mt-1 text-xs text-foreground/60">{autofill.isPending ? "Loading your saved profile…" : "Your name and account email are filled from your profile when available. Check them before continuing."}</p>
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
          <label className="block text-sm font-medium">Why are you interested? (optional)
            <Textarea maxLength={3000} value={motivation} onChange={(event) => setMotivation(event.target.value)} className="mt-1" rows={3} />
          </label>
          <div className="rounded-lg bg-muted/60 p-3 text-xs text-foreground/70">
            Saving stores your application in OppPilot only. You can also try the official organiser form directly below; external forms may require additional information or documents.
          </div>
          {submit.isError && <p role="alert" className="text-sm text-destructive">{submit.error instanceof Error ? submit.error.message : 'Could not submit. Please use the official page.'}</p>}
          {submit.isSuccess && !submit.data.submitted && (
            <div role="status" className="rounded-lg border border-border p-3 text-sm">
              <p className="font-medium">Not confirmed as submitted</p>
              <p className="mt-1">{submit.data.summary}</p>
              {submit.data.missingFields.length > 0 && <p className="mt-1">Still needed: {submit.data.missingFields.join(', ')}</p>}
              {submit.data.finalUrl && <a className="mt-2 inline-block underline" href={submit.data.finalUrl} target="_blank" rel="noreferrer">Continue on official website</a>}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="rounded-full" disabled={submit.isPending} onClick={() => {
              const confirmed = window.confirm('Send your application details to the organiser for "' + title + '"? OppPilot will report success only if the website confirms submission.')
              if (confirmed) submit.mutate()
            }}>{submit.isPending ? 'Working on official form…' : 'Review & submit to organiser'}</Button>
            <Button type="submit" variant="outline" disabled={save.isPending} className="rounded-full">{save.isPending ? 'Saving…' : 'Save to My Applications'}</Button>
          </div>
        </form>
      )}
    </div>
  )
}
