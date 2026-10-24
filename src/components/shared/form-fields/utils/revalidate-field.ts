interface FieldWithValidation {
  state: {
    meta: {
      isTouched: boolean
      isValid: boolean
    }
  }
  validate: (cause: 'blur') => unknown
}

// Call after `field.handleChange` so a field that is showing an error clears it
// as soon as the value becomes valid, instead of waiting for the next blur.
export function revalidateFieldIfStaleError(field: FieldWithValidation) {
  if (!field.state.meta.isTouched || field.state.meta.isValid) {
    return
  }

  queueMicrotask(() => {
    void field.validate('blur')
  })
}
