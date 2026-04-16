import type { ReactElement } from 'react';

export interface CreatePropertyFormFieldProps {
  readonly children: ReactElement;
  readonly error?: string;
  readonly id: string;
  readonly label: string;
}
