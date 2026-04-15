import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { cn } from './utils';

export function Label({ className, ...props }: ComponentPropsWithoutRef<'label'>): ReactElement {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  );
}
