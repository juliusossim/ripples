import type { Ref } from 'react';
import z from 'zod';
import { CommonSchemas } from './commonSchemaBuilders';
import { ValidationMessages } from './validationsMessages';

export const createPasswordConfirmationSchema = () => {
  return z
    .object({
      password: CommonSchemas.password(),
      confirmPassword: z
        .string()
        .min(1, ValidationMessages.required('Confirm Password')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: ValidationMessages.passwordMatch,
      path: ['confirmPassword'],
    });
};

/**
 * Transform string to number for form inputs
 */
export const stringToNumber = z
  .string()
  .transform((val) => (val === '' ? undefined : Number(val)))
  .pipe(z.number().optional());

/**
 * Transform string to date for form inputs
 */
export const stringToDate = z
  .string()
  .transform((val) => (val === '' ? undefined : new Date(val)))
  .pipe(z.date().optional());

/**
 * Extract error messages from Zod validation errors for display
 */
export const extractZodErrors = (error: z.ZodError) => {
  return error.issues.reduce<Record<string, string>>((acc, curr) => {
    const path = curr.path.join('.');
    acc[path] = curr.message;
    return acc;
  }, {});
};

export const assignRef = <T>(ref: Ref<T> | undefined, node: T | null) => {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
};

export const composeRefs = <T>(...refs: Array<Ref<T> | undefined>) => {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
};
