import type z from 'zod';

export type FormDataFromSchema<TSchema extends z.ZodType> = z.infer<TSchema>;
