import type { ComponentPropsWithoutRef } from 'react';
import type { SeparatorProps } from '../separator';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export type ButtonGroupProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    orientation?: ButtonGroupOrientation;
  }
>;

export type ButtonGroupTextProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    asChild?: boolean;
  }
>;

export type ButtonGroupSeparatorProps = Readonly<SeparatorProps>;
