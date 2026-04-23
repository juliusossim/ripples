import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { useFormContext, type FieldValues } from 'react-hook-form';
import type { FieldWrapperProps } from './field-wrapper.types';

export function FieldWrapper<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  children,
}: Readonly<FieldWrapperProps<TFieldValues>>): ReactElement {
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? (
            <FormLabel>
              {label}
              {required ? <span className="ml-1 text-destructive">*</span> : null}
            </FormLabel>
          ) : null}
          <FormControl>{children(field)}</FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
