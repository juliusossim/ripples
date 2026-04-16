import type { SignInFormValues } from './sign-in-form.schema';

export interface SignInFormProps {
  readonly disabled: boolean;
  readonly isSubmitting: boolean;
  readonly message?: string;
  readonly onSubmit: (input: SignInFormValues) => Promise<void>;
}
