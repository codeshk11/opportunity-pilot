import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { IconCheck, IconClipboardList } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveOppPilotApplication } from '@/features/dashboard/api/save-opppilot-application'

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

  if (save.isSuccess) {
    return (
      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="flex items-center gap-2 font-semibold"><IconCheck aria-hidden className="size-4" /> Saved to My Applications</p>
        <p className="mt-1">Your details are saved in OppPilot. This is not an official submission to the organizer.</p>
      </div>
    )
  }

  return (
    <div className="mt-3">
      <Button type="button" onClick={() => setOpen(!open)} variant="default" className="rounded-full">
        <IconClipboardList data-icon="inline-start" />
        {open ? 'Close application form' : 'Apply on OppPilot'}
      </Button>
      {open && (
        <form className="mt-3 space-y-3 rounded-xl border border-border bg-background p-4" onSubmit={(event) => { event.preventDefault(); save.mutate() }}>
          <div>
            <h4 className="font-semibold">Your application details</h4>
            <p className="mt-1 text-xs text-foreground/60">Fill this once on OppPilot. You can review what you entered before saving.</p>
          </div>
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
            Important: this saves an application record in OppPilot only. The opportunity organizer has not received your details, and no official application is submitted.
          </div>
          {save.isError && <p role="alert" className="text-sm text-destructive">{save.error instanceof Error ? save.error.message : 'Could not save. Please try again.'}</p>}
          <Button type="submit" disabled={save.isPending} className="rounded-full">{save.isPending ? 'Saving…' : 'Save to My Applications'}</Button>
        </form>
      )}
    </div>
  )
}
