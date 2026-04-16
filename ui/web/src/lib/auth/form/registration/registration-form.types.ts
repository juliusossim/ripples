import type { RegistrationFormValues } from './registration-form.schema';

export interface RegistrationFormProps {
  readonly disabled: boolean;
  readonly isSubmitting: boolean;
  readonly message?: string;
  readonly onSubmit: (input: RegistrationFormValues) => Promise<void>;
}
