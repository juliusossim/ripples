import { useEffect } from 'react';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';

/**
 * Hook for form auto-save functionality
 * Automatically saves form data after a debounce period
 *
 * @param {UseFormReturn<TFieldValues>} form - The react-hook-form instance
 * @param {(data: TFieldValues) => Promise<void> | void} onSave - The callback to be executed when the form data is saved
 * @param {Object} [options] - Optional configuration object
 * @param {number} [options.debounceMs] - The debounce period in milliseconds (defaults to 2000)
 * @param {boolean} [options.enabled] - Whether the auto-save functionality is enabled (defaults to true)
 */
export function useFormAutoSave<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  onSave: (data: TFieldValues) => Promise<void> | void,
  options?: {
    debounceMs?: number;
    enabled?: boolean;
  }
) {
  const { watch, formState } = form;
  const { isDirty, isValid } = formState;
  const debounceMs = options?.debounceMs ?? 2000;
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled || !isDirty || !isValid) {
      return;
    }

    const subscription = watch((data) => {
      const timeoutId = setTimeout(() => {
        onSave(data as TFieldValues);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch, onSave, debounceMs, enabled, isDirty, isValid]);
}
