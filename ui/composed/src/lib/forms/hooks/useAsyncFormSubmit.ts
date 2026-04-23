import { useCallback } from 'react';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';

/**
 * Hook for handling async form submission with loading states
 * Automatically sets form error if submission fails
 *
 * @param form - The form object returned from useForm
 * @param onSubmit - The callback function to call when submitting the form
 * @returns A memoized function that handles async form submission
 */
export function useAsyncFormSubmit<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  onSubmit: (data: TFieldValues) => Promise<void>
) {
  const handleSubmit = useCallback(
    async (data: TFieldValues) => {
      try {
        await onSubmit(data);
      } catch (error) {
        // Set form error if submission fails
        if (error instanceof Error) {
          form.setError('root', {
            type: 'manual',
            message: error.message,
          });
        }
      }
    },
    [onSubmit, form]
  );

  return form.handleSubmit(handleSubmit);
}
