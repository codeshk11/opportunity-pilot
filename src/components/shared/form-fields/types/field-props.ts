import type { HTMLInputTypeAttribute } from 'react'

import type {
  BaseFieldProps,
  FreeTextFieldName,
  StringArrayFieldName,
  StringArrayItemValue,
  StringFieldName,
  StringFieldValue,
} from './base'
import type { FieldOption } from './options'

export interface InputFieldProps<
  TFormData,
  TName extends FreeTextFieldName<TFormData>,
> extends BaseFieldProps<TFormData, TName> {
  placeholder?: string
  type?: Extract<
    HTMLInputTypeAttribute,
    'text' | 'email' | 'number' | 'search' | 'tel' | 'url'
  >
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  min?: number
  max?: number
  step?: number | 'any'
  maxLength?: number
  autoComplete?: string
}

export interface PasswordFieldProps<
  TFormData,
  TName extends FreeTextFieldName<TFormData>,
> extends BaseFieldProps<TFormData, TName> {
  placeholder?: string
  autoComplete?: 'current-password' | 'new-password'
  maxLength?: number
}

export interface SelectFieldProps<
  TFormData,
  TName extends StringFieldName<TFormData>,
> extends BaseFieldProps<TFormData, TName> {
  options: ReadonlyArray<FieldOption<StringFieldValue<TFormData, TName>>>
  placeholder?: string
}

export interface ToggleGroupFieldProps<
  TFormData,
  TName extends StringFieldName<TFormData>,
> extends BaseFieldProps<TFormData, TName> {
  multiple?: false
  options: ReadonlyArray<FieldOption<StringFieldValue<TFormData, TName>>>
}

export interface MultiToggleGroupFieldProps<
  TFormData,
  TName extends StringArrayFieldName<TFormData>,
> extends BaseFieldProps<TFormData, TName> {
  multiple: true
  options: ReadonlyArray<FieldOption<StringArrayItemValue<TFormData, TName>>>
}
