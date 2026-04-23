import { useEffect } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export function useDebouncedValidation<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  fieldName: Path<TFieldValues>,
  validate: (value: unknown) => Promise<boolean | string>,
  debounceMs = 500,
): void {
  const { watch, setError, clearErrors } = form;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const subscription = watch((value, { name }) => {
      if (name !== fieldName) {
        return;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const fieldValue = value[fieldName];

      timeoutId = setTimeout(async () => {
        try {
          const result = await validate(fieldValue);

          if (result === true) {
            clearErrors(fieldName);
            return;
          }

          if (typeof result === 'string') {
            setError(fieldName, {
              type: 'manual',
              message: result,
            });
          }
        } catch {
          setError(fieldName, {
            type: 'manual',
            message: 'Validation failed',
          });
        }
      }, debounceMs);
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [watch, fieldName, validate, debounceMs, setError, clearErrors]);
}
