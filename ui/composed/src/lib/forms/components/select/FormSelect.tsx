import { cn } from '../../../utils';
import * as React from 'react';
import { composeRefs } from '../../utils/formHelpers';
import { FieldWrapper } from '../FieldWrappper';

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      name,
      label,
      description,
      required,
      options,
      placeholder,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <FieldWrapper
        name={name}
        label={label}
        description={description}
        required={required}
      >
        {(field) => {
          const { ref: fieldRef, ...fieldProps } = field;

          return (
            <select
              {...fieldProps}
              {...props}
              ref={composeRefs(fieldRef, ref)}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className
              )}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }}
      </FieldWrapper>
    );
  }
);

FormSelect.displayName = 'FormSelect';
