import { z } from 'zod';

export const createPropertyFormSchema = z.object({
  title: z.string().trim().min(3, 'Use at least 3 characters.').max(160),
  description: z.string().trim().min(10, 'Use at least 10 characters.').max(5000),
  city: z.string().trim().min(1, 'City is required.').max(120),
  country: z.string().trim().min(1, 'Country is required.').max(120),
  priceAmount: z.coerce.number().positive('Price must be greater than zero.'),
  priceCurrency: z
    .string()
    .trim()
    .length(3, 'Use a 3-letter currency code.')
    .transform((value) => value.toUpperCase()),
  imageUrl: z.url('Enter a valid image URL.'),
  imageAlt: z.string().trim().min(1, 'Describe the image.').max(240),
});

export type CreatePropertyFormInput = z.input<typeof createPropertyFormSchema>;
export type CreatePropertyFormValues = z.output<typeof createPropertyFormSchema>;
