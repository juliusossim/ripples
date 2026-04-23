import type { ComponentPropsWithoutRef } from 'react';
import type { InputGroupInput } from '@org/ui-primitives';

export type SearchInputProps = Readonly<
  Omit<ComponentPropsWithoutRef<typeof InputGroupInput>, 'name'> & {
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
    clearButtonLabel?: string;
    submitButtonLabel?: string;
    showClear?: boolean;
    handleClear?: () => void;
    inputGroupClassName?: string;
  }
>;
