import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm as useHookForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';
import type * as z from 'zod';

export function useZodForm<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema> & FieldValues>, 'resolver'>,
): UseFormReturn<z.infer<TSchema> & FieldValues> {
  type Values = z.infer<TSchema> & FieldValues;
  const resolverSchema = schema as Parameters<typeof zodResolver>[0];

  return useHookForm<Values>({
    resolver: zodResolver(resolverSchema) as unknown as UseFormProps<Values>['resolver'],
    mode: 'onTouched',
    reValidateMode: 'onChange',
    ...options,
  });
}
