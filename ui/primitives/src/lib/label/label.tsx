import type { ReactElement } from 'react';
import { cn } from '../utils';
import type { LabelProps } from './label.types';

export function Label({ className, ...props }: LabelProps): ReactElement {
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
