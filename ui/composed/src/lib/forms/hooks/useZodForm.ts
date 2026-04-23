import { zodResolver } from '@hookform/resolvers/zod';
import {
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  useForm as useHookForm,
} from 'react-hook-form';
import { z, type ZodObject, type ZodRawShape } from 'zod';

type InferValues<TShape extends ZodRawShape> = z.output<ZodObject<TShape>> &
  FieldValues;

/**
 * Form hook with Zod validation
 * Wraps react-hook-form with best practices and type safety
 *
 * @param {ZodObject<TShape>} schema - The Zod schema for the form
 * @param {Omit<UseFormProps<InferValues<TShape>>, "resolver">} options - Options for the hook form
 * @return {UseFormReturn<InferValues<TShape>>} - The hook form return value
 */
export function useZodForm<TShape extends ZodRawShape>(
  schema: ZodObject<TShape>,
  options?: Omit<UseFormProps<InferValues<TShape>>, 'resolver'>
): UseFormReturn<InferValues<TShape>> {
  type Values = InferValues<TShape>;

  return useHookForm<Values>({
    resolver: zodResolver(
      schema
    ) as unknown as UseFormProps<Values>['resolver'],
    mode: 'onTouched',
    reValidateMode: 'onChange',
    ...options,
  });
}
