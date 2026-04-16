import type { ReactElement } from 'react';
import { Button, Input, Label } from '@org/ui-primitives';
import { GoogleIcon } from '../../google/auth-page-utils';
import type {
  AuthCheckboxFieldProps,
  AuthDividerProps,
  AuthStatusMessageProps,
  AuthTextFieldProps,
  GoogleAuthButtonProps,
} from './auth-form-controls.types';

export function AuthTextField({
  error,
  id,
  label,
  ...props
}: Readonly<AuthTextFieldProps>): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function AuthCheckboxField({
  error,
  label,
  ...props
}: Readonly<AuthCheckboxFieldProps>): ReactElement {
  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          className="mt-1 size-4 rounded border border-input accent-primary"
          type="checkbox"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function AuthDivider({ children }: Readonly<AuthDividerProps>): ReactElement {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">{children}</span>
      </div>
    </div>
  );
}

export function GoogleAuthButton({
  disabled,
  isConnecting,
  label,
  onClick,
}: Readonly<GoogleAuthButtonProps>): ReactElement {
  return (
    <Button className="w-full" disabled={disabled} onClick={onClick} variant="outline">
      <GoogleIcon />
      {isConnecting ? 'Connecting to Google...' : label}
    </Button>
  );
}

export function AuthStatusMessage({
  message,
}: Readonly<AuthStatusMessageProps>): ReactElement | null {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">{message}</p>
  );
}
