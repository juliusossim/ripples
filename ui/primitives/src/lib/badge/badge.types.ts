import type { ComponentPropsWithoutRef } from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export type BadgeProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    variant?: BadgeVariant;
  }
>;
