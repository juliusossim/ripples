import type { InputHTMLAttributes } from 'react';

export type FormInputProps = Readonly<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
  }
>;
