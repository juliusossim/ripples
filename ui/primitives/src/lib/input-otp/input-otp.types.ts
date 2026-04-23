import type { ComponentPropsWithoutRef } from 'react';
import type { OTPInput } from 'input-otp';

export type InputOTPProps = Readonly<
  ComponentPropsWithoutRef<typeof OTPInput> & {
    containerClassName?: string;
  }
>;

export type InputOTPGroupProps = Readonly<ComponentPropsWithoutRef<'div'>>;

export type InputOTPSlotProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    index: number;
  }
>;

export type InputOTPSeparatorProps = Readonly<ComponentPropsWithoutRef<'div'>>;
