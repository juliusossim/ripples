import type { ReactElement } from 'react';
import { Label } from '@org/ui-primitives';
import type { CreatePropertyFormFieldProps } from './create-property-form-field.types';

export function CreatePropertyFormField({
  children,
  error,
  id,
  label,
}: Readonly<CreatePropertyFormFieldProps>): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
