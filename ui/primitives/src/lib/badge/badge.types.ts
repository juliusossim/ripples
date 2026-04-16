import type { ComponentPropsWithoutRef } from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends ComponentPropsWithoutRef<'div'> {
  readonly variant?: BadgeVariant;
}
