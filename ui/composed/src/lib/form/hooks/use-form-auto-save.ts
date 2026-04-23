import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export function useFormAutoSave<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  onSave: (data: TFieldValues) => Promise<void> | void,
  options?: Readonly<{
    debounceMs?: number;
    enabled?: boolean;
  }>,
): void {
  const { watch, formState, getValues } = form;
  const { isDirty, isValid } = formState;
  const debounceMs = options?.debounceMs ?? 2000;
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled || !isDirty || !isValid) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const subscription = watch(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        void onSave(getValues());
      }, debounceMs);
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [watch, onSave, debounceMs, enabled, isDirty, isValid, getValues]);
}
