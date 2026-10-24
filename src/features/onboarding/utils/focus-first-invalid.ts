// Pass as a form's `onSubmitInvalid`: moves focus to the first invalid control
// once the errors have rendered.
export function focusFirstInvalid(form: HTMLFormElement | null) {
  requestAnimationFrame(() => {
    form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  })
}
