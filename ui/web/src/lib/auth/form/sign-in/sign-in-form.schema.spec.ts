import { signInFormSchema } from './sign-in-form.schema';

describe('signInFormSchema', () => {
  it('validates sign-in input', () => {
    const result = signInFormSchema.safeParse({
      email: 'not-an-email',
      password: '',
    });

    expect(result.success).toBe(false);
  });
});
