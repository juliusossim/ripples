import { z } from 'zod';

export const registrationFormSchema = z.object({
  acceptedTerms: z.boolean().refine((value) => value, {
    message: 'Please accept the terms and privacy policy to continue.',
  }),
  email: z.email('Enter a valid email address.'),
  fullName: z.string().trim().refine(hasAtLeastTwoNames, {
    message: 'Enter at least first and last name.',
  }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[a-z]/, 'Password must include a lowercase letter.')
    .regex(/[A-Z]/, 'Password must include an uppercase letter.')
    .regex(/\d/, 'Password must include a number.')
    .regex(/[^A-Za-z0-9]/, 'Password must include a special character.'),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

function hasAtLeastTwoNames(value: string): boolean {
  return value.split(/\s+/).filter(Boolean).length >= 2;
}
