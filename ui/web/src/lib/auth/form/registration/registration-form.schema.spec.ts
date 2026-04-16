import { registrationFormSchema } from './registration-form.schema';

describe('registrationFormSchema', () => {
  it('requires accepted terms', () => {
    const result = registrationFormSchema.safeParse({
      acceptedTerms: false,
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      password: 'Correct1!',
    });

    expect(result.success).toBe(false);
  });

  it('requires at least two names', () => {
    const result = registrationFormSchema.safeParse({
      acceptedTerms: true,
      email: 'ada@example.com',
      fullName: 'Ada',
      password: 'Correct1!',
    });

    expect(result.success).toBe(false);
  });

  it('requires a strong password', () => {
    const result = registrationFormSchema.safeParse({
      acceptedTerms: true,
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      password: 'weakpass',
    });

    expect(result.success).toBe(false);
  });

  it('accepts valid input', () => {
    const result = registrationFormSchema.safeParse({
      acceptedTerms: true,
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      password: 'Correct1!',
    });

    expect(result.success).toBe(true);
  });
});
