import * as React from 'react';

export interface SearchInputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'name'> {
  name: string;
  description?: string;
  placeholder?: string;
  handleClear?: () => void;
  label?: string;
  required?: boolean;
  showClear?: boolean;
  clearButtonLabel?: string;
  submitButtonLabel?: string;
  inputGroupClassName?: string;
}
