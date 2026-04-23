import type { ReactNode } from 'react';

export type FormCheckboxProps = Readonly<{
  name: string;
  label?: string | ReactNode;
  description?: string;
  disabled?: boolean;
}>;
