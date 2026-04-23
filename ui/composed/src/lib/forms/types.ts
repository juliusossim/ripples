import z from 'zod';

/**
 * Type helper for form data with Zod schema
 */
export type FormDataFromSchema<T extends z.ZodTypeAny> = z.infer<T>;
