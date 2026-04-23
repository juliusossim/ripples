import * as React from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';

/**
 * Enterprise-grade form input component with built-in validation
 */
export interface FieldWrapperProps {
  name: string;
  children: (field: ControllerRenderProps) => React.ReactNode;
  label?: string;
  description?: string;
  required?: boolean;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  name,
  label,
  description,
  required,
  children,
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>{children(field)}</FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
