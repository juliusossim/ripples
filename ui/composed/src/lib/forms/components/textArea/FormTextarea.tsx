import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../ui/form';
import { Textarea } from '../../../ui/textarea';

/**
 * Enterprise-grade form textarea component with built-in validation
 */
export interface FormTextareaProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Textarea>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(({ name, label, description, required, ...props }, ref) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea {...field} {...props} ref={ref} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

FormTextarea.displayName = 'FormTextarea';
