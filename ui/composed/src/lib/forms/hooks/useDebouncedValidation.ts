import { useEffect } from 'react';
import { Path, type FieldValues, type UseFormReturn } from 'react-hook-form';

/**
 * Hook for debouncing field-level validation
 * Useful for async validations like checking username availability
 *
 * @param form The form context
 * @param fieldName The name of the field to validate
 * @param validate The validation function
 * @param debounceMs The debounce time in milliseconds (default: 500)
 */
export function useDebouncedValidation<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  fieldName: Path<TFieldValues>,
  validate: (value: unknown) => Promise<boolean | string>,
  debounceMs = 500
) {
  const { watch, setError, clearErrors } = form;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name !== fieldName) return;

      const fieldValue = value[fieldName];

      const timeoutId = setTimeout(async () => {
        try {
          const result = await validate(fieldValue);

          if (result === true) {
            clearErrors(fieldName);
          } else if (typeof result === 'string') {
            setError(fieldName, {
              type: 'manual',
              message: result,
            });
          }
        } catch (err) {
          console.error('Validation error:', err);
          setError(fieldName, {
            type: 'manual',
            message: 'Validation failed',
          });
        }
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, fieldName, validate, debounceMs, setError, clearErrors]);
}
