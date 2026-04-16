import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ReactElement } from 'react';
import { Button } from '@org/ui-primitives';
import { AuthStatusMessage, AuthTextField } from '../shared/auth-form-controls';
import { signInFormSchema, type SignInFormValues } from './sign-in-form.schema';
import type { SignInFormProps } from './sign-in-form.types';

export function SignInForm({
  disabled,
  isSubmitting,
  message,
  onSubmit,
}: Readonly<SignInFormProps>): ReactElement {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInFormSchema),
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <AuthTextField
        autoComplete="email"
        error={errors.email?.message}
        id="sign-in-email"
        inputMode="email"
        label="Email"
        placeholder="ada@example.com"
        type="email"
        {...register('email')}
      />
      <AuthTextField
        autoComplete="current-password"
        error={errors.password?.message}
        id="sign-in-password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        {...register('password')}
      />
      <AuthStatusMessage message={message} />
      <Button className="w-full" disabled={disabled} type="submit">
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
