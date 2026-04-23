import { z } from 'zod';

const createPropertyMediaItemSchema = z.object({
  alt: z.string().trim().min(1, 'Describe each media item.').max(240),
  id: z.string().trim().min(1),
  mimeType: z.string().trim().optional(),
  source: z.enum(['device', 'dropbox', 'google-drive', 'direct-url']),
  type: z.enum(['image', 'video']),
  url: z.url('Enter a valid media URL.'),
});

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
  media: z
    .array(createPropertyMediaItemSchema)
    .min(1, 'Add at least one image or video.')
    .max(12, 'Use up to 12 media items per listing.'),
});

export type CreatePropertyFormInput = z.input<typeof createPropertyFormSchema>;
export type CreatePropertyFormValues = z.output<typeof createPropertyFormSchema>;
