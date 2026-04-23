import { useCallback } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export function useAsyncFormSubmit<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  onSubmit: (data: TFieldValues) => Promise<void>,
): ReturnType<UseFormReturn<TFieldValues>['handleSubmit']> {
  const handleSubmit = useCallback(
    async (data: TFieldValues): Promise<void> => {
      try {
        await onSubmit(data);
      } catch (error) {
        if (error instanceof Error) {
          form.setError('root', {
            type: 'manual',
            message: error.message,
          });
        }
      }
    },
    [form, onSubmit],
  );

  return form.handleSubmit(handleSubmit);
}
