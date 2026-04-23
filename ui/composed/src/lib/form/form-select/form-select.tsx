import { cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import { composeRefs } from '../utils';
import { FieldWrapper } from '../field-wrapper';
import type { FormSelectProps } from './form-select.types';

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  function FormSelect(
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
    ref,
  ): ReactElement {
    return (
      <FieldWrapper
        description={description}
        label={label}
        name={name}
        required={required}
      >
        {(field) => {
          const { ref: fieldRef, ...fieldProps } = field;

          return (
            <select
              {...fieldProps}
              {...props}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className,
              )}
              ref={composeRefs(fieldRef, ref)}
            >
              {placeholder ? (
                <option disabled value="">
                  {placeholder}
                </option>
              ) : null}
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
  },
);
