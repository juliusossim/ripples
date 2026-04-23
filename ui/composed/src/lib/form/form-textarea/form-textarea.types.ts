import type { ComponentPropsWithoutRef } from 'react';
import type { Textarea } from '@org/ui-primitives';

export type FormTextareaProps = Readonly<
  Omit<ComponentPropsWithoutRef<typeof Textarea>, 'name'> & {
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
  }
>;
