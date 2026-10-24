import { InputField } from './components/fields/input-field'
import { PasswordField } from './components/fields/password-field'
import { SelectField } from './components/fields/select-field'
import { ToggleGroupField } from './components/fields/toggle-group-field'

// =============================================================================
// Custom field primitives
// =============================================================================
// Building blocks for feature-local fields that inline `form.Field`. They give
// a custom control the same look, label, message, ID and revalidation
// behavior as the shared fields. See DEVELOPMENT.md "Forms".

export { FIELD_CLASS_NAMES } from './constants'
export { FormFieldFrame } from './components/shared/form-field-frame'
export { FieldMessages } from './components/shared/field-messages'
export { RequiredLabel } from './components/shared/required-label'
export { getFieldA11yIds } from './utils/field-a11y'
export type { FieldA11yIds } from './utils/field-a11y'
export { revalidateFieldIfStaleError } from './utils/revalidate-field'

// =============================================================================
// FormFields namespace
// =============================================================================
// Dot-access API: FormFields.Input, FormFields.Select, etc.

export const FormFields = {
  Input: InputField,
  Password: PasswordField,
  Select: SelectField,
  ToggleGroup: ToggleGroupField,
} as const

// =============================================================================
// Public type exports
// =============================================================================

export type {
  BaseFieldProps,
  FormFieldName,
  FormFieldValue,
  FormFieldsApi,
  FreeTextFieldName,
  StringArrayFieldName,
  StringFieldName,
} from './types/base'
export type {
  InputFieldProps,
  MultiToggleGroupFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  ToggleGroupFieldProps,
} from './types/field-props'
export type { FieldErrorValue, FieldOption } from './types/options'
