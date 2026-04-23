import type { SelectHTMLAttributes } from 'react';

export type FormSelectOption = Readonly<{
  value: string;
  label: string;
}>;

export type FormSelectProps = Readonly<
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> & {
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
    options: readonly FormSelectOption[];
    placeholder?: string;
  }
>;
