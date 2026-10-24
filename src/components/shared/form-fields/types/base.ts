import type {
  DeepKeys,
  DeepValue,
  ReactFormExtendedApi,
  UseFieldOptionsBound,
} from '@tanstack/react-form'
import type { ReactNode } from 'react'

// =============================================================================
// Form API types
// =============================================================================

// Any `useForm` instance over TFormData, whatever validators it was built with.
export type FormFieldsApi<TFormData> = ReactFormExtendedApi<
  TFormData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export type FormFieldName<TFormData> = DeepKeys<TFormData>

export type FormFieldValue<
  TFormData,
  TName extends FormFieldName<TFormData>,
> = DeepValue<TFormData, TName>

// =============================================================================
// Field name constraints
// =============================================================================
//
// Narrow `name` to form keys whose value type matches the control (string,
// string[], ...) so field components stay type-safe.

type FieldNameAssignableTo<TFormData, TValue> = {
  [TName in DeepKeys<TFormData>]: DeepValue<TFormData, TName> extends TValue
    ? TName
    : never
}[DeepKeys<TFormData>]

type FieldNameAccepting<TFormData, TValue> = {
  [TName in DeepKeys<TFormData>]: TValue extends DeepValue<TFormData, TName>
    ? TName
    : never
}[DeepKeys<TFormData>]

export type StringFieldName<TFormData> = FieldNameAssignableTo<
  TFormData,
  string | null | undefined
>

export type FreeTextFieldName<TFormData> = FieldNameAccepting<TFormData, string>

export type StringArrayFieldName<TFormData> = FieldNameAssignableTo<
  TFormData,
  Array<string> | null | undefined
>

// =============================================================================
// Field value types
// =============================================================================

export type StringFieldValue<
  TFormData,
  TName extends FormFieldName<TFormData>,
> = Extract<NonNullable<FormFieldValue<TFormData, TName>>, string>

export type StringArrayItemValue<
  TFormData,
  TName extends FormFieldName<TFormData>,
> =
  NonNullable<FormFieldValue<TFormData, TName>> extends Array<infer TValue>
    ? Extract<TValue, string>
    : string

// =============================================================================
// FieldOptionsPassthrough
// =============================================================================

export type FieldOptionsPassthrough<
  TFormData,
  TName extends FormFieldName<TFormData>,
> = Omit<
  UseFieldOptionsBound<
    TFormData,
    TName,
    FormFieldValue<TFormData, TName>,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  'children' | 'name'
>

// =============================================================================
// BaseFieldProps
// =============================================================================

export interface BaseFieldProps<
  TFormData,
  TName extends FormFieldName<TFormData>,
> {
  form: FormFieldsApi<TFormData>
  name: TName
  label: string
  isRequired?: boolean
  description?: ReactNode
  disabled?: boolean
  fieldOptions?: FieldOptionsPassthrough<TFormData, TName>
}
