import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Input } from '@org/ui-primitives';

export interface AuthTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  readonly error?: string;
  readonly label: string;
}

export interface AuthCheckboxFieldProps extends ComponentPropsWithoutRef<'input'> {
  readonly error?: string;
  readonly label: string;
}

export interface AuthDividerProps {
  readonly children: ReactNode;
}

export interface GoogleAuthButtonProps {
  readonly disabled: boolean;
  readonly isConnecting: boolean;
  readonly label: string;
  readonly onClick: () => void;
}

export interface AuthStatusMessageProps {
  readonly message?: string;
}
