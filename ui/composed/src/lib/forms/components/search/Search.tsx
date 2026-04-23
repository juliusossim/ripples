import { Search, X } from 'lucide-react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { ButtonGroup } from '../../../ui/button-group';

import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '../../../ui/input-group';
import { cn } from '../../../utils';
import { composeRefs } from '../../utils/formHelpers';
import { FieldWrapper } from '../FieldWrappper';
import { SearchInputProps } from './type';

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      clearButtonLabel = 'Clear search',
      description,
      handleClear,
      inputGroupClassName,
      label,
      name,
      required,
      showClear = true,
      submitButtonLabel = 'Submit search',
      className,
      ...props
    },
    ref
  ) => {
    const form = useFormContext();
    const onClear = React.useCallback(() => {
      form.setValue(name, '', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      handleClear?.();
    }, [form, handleClear, name]);

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
            <InputGroup className={cn('bg-white px-1', inputGroupClassName)}>
              <InputGroupInput
                {...fieldProps}
                {...props}
                className={cn(
                  'focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none',
                  className
                )}
                ref={composeRefs(fieldRef, ref)}
              />
              <ButtonGroup>
                {showClear && Boolean(field.value) && (
                  <InputGroupButton
                    aria-label={clearButtonLabel}
                    className="border-0"
                    onClick={onClear}
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <X />
                  </InputGroupButton>
                )}
                <InputGroupButton
                  aria-label={submitButtonLabel}
                  className="border-0"
                  size="icon-sm"
                  type="submit"
                  variant="ghost"
                >
                  <Search color="black" />
                </InputGroupButton>
              </ButtonGroup>
            </InputGroup>
          );
        }}
      </FieldWrapper>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
