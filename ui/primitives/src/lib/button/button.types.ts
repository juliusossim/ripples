import type { ComponentPropsWithoutRef } from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './button.variants';

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
}
