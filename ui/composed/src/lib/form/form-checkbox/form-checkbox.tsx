import {
  Checkbox,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormCheckboxProps } from './form-checkbox.types';

export function FormCheckbox({
  name,
  label,
  description,
  disabled,
}: Readonly<FormCheckboxProps>): ReactElement {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={Boolean(field.value)}
              disabled={disabled}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label ? <FormLabel>{label}</FormLabel> : null}
            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
