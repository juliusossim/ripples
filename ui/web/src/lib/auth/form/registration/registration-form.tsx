import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ReactElement } from 'react';
import { Button } from '@org/ui-primitives';
import { AuthCheckboxField, AuthStatusMessage, AuthTextField } from '../shared/auth-form-controls';
import { registrationFormSchema, type RegistrationFormValues } from './registration-form.schema';
import type { RegistrationFormProps } from './registration-form.types';

export function RegistrationForm({
  disabled,
  isSubmitting,
  message,
  onSubmit,
}: Readonly<RegistrationFormProps>): ReactElement {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      acceptedTerms: false,
      email: '',
      fullName: '',
      password: '',
    },
    resolver: zodResolver(registrationFormSchema),
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <AuthTextField
        autoComplete="name"
        error={errors.fullName?.message}
        id="full-name"
        label="Full name"
        placeholder="Ada Lovelace"
        {...register('fullName')}
      />
      <AuthTextField
        autoComplete="email"
        error={errors.email?.message}
        id="email"
        inputMode="email"
        label="Email"
        placeholder="ada@example.com"
        type="email"
        {...register('email')}
      />
      <AuthTextField
        autoComplete="new-password"
        error={errors.password?.message}
        id="password"
        label="Password"
        placeholder="Create a strong password"
        type="password"
        {...register('password')}
      />
      <AuthCheckboxField
        error={errors.acceptedTerms?.message}
        label="I agree to the terms and privacy policy."
        {...register('acceptedTerms')}
      />
      <AuthStatusMessage message={message} />
      <Button className="w-full" disabled={disabled} type="submit">
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
