import { useId, useState } from 'react'
import { IconPlus, IconX } from '@tabler/icons-react'
import { AnimatePresence, m } from 'motion/react'

import type { AmbitionsStepValues } from '../../schemas/steps'
import type { FormFieldsApi } from '@/components/shared/form-fields'
import {
  FIELD_CLASS_NAMES,
  FormFieldFrame,
  getFieldA11yIds,
  revalidateFieldIfStaleError,
} from '@/components/shared/form-fields'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { MAX_SKILLS, MAX_SKILL_LENGTH } from '@/features/profile/constants'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

// Free-text skill tags; needs the layout features (`loadLayoutFeatures`). Enter, a comma, the + button or leaving the input
// adds the typed skill, so nothing typed is lost when the form submits.
export function SkillsField({
  form,
}: {
  form: FormFieldsApi<AmbitionsStepValues>
}) {
  const fieldId = useId()
  const [draft, setDraft] = useState('')

  return (
    <form.Field name="skills">
      {(field) => {
        const skills = field.state.value
        const isFull = skills.length >= MAX_SKILLS
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        const errors = isInvalid ? field.state.meta.errors : undefined
        const ids = getFieldA11yIds({
          fieldId,
          hasDescription: true,
          hasErrors: Boolean(errors?.length),
        })

        function addDraft() {
          const skill = draft.trim()
          setDraft('')
          if (!skill || isFull) return
          const isDuplicate = skills.some(
            (existing) => existing.toLowerCase() === skill.toLowerCase(),
          )
          if (isDuplicate) return
          field.handleChange([...skills, skill])
          revalidateFieldIfStaleError(field)
        }

        return (
          <FormFieldFrame
            ids={ids}
            label="Skills"
            description={`Optional. Press Enter after each one, up to ${MAX_SKILLS}.`}
            errors={errors}
            isInvalid={isInvalid}
          >
            <InputGroup className={cn(FIELD_CLASS_NAMES.control, 'px-0')}>
              <InputGroupInput
                id={ids.controlId}
                value={draft}
                maxLength={MAX_SKILL_LENGTH}
                disabled={isFull}
                placeholder={
                  isFull
                    ? 'Skill limit reached'
                    : 'e.g. Python, writing, design'
                }
                aria-describedby={ids.describedBy}
                aria-invalid={isInvalid}
                className="px-3"
                onChange={(event) => setDraft(event.target.value)}
                onBlur={() => {
                  addDraft()
                  field.handleBlur()
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault()
                    addDraft()
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  aria-label="Add skill"
                  // Disabling it while the draft is empty would grey out the whole
                  // group, so an empty add is a no-op instead.
                  disabled={isFull}
                  onClick={addDraft}
                >
                  <IconPlus />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {/* Tags pop in and out while their neighbours glide into place.
                `empty:hidden` drops the list once the last exit finishes. */}
            <ul
              aria-label="Your skills"
              className="relative flex flex-wrap gap-2 empty:hidden"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {skills.map((skill) => (
                  <m.li
                    key={skill}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.85,
                      transition: { duration: 0.12, ease: EASE_OUT },
                    }}
                    transition={{
                      type: 'spring',
                      duration: 0.35,
                      bounce: 0.15,
                    }}
                    className="inline-flex max-w-full items-center gap-1 rounded-full bg-card py-1 pr-1 pl-3 text-sm shadow-sm"
                  >
                    <span className="truncate">{skill}</span>
                    <InputGroupButton
                      size="icon-xs"
                      className="rounded-full"
                      aria-label={`Remove ${skill}`}
                      onClick={() => {
                        field.handleChange(
                          skills.filter((existing) => existing !== skill),
                        )
                      }}
                    >
                      <IconX />
                    </InputGroupButton>
                  </m.li>
                ))}
              </AnimatePresence>
            </ul>
          </FormFieldFrame>
        )
      }}
    </form.Field>
  )
}
