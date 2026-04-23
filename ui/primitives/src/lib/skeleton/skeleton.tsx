import { cn } from '../utils';
import type { SkeletonProps } from './skeleton.types';

function Skeleton({ className, ...props }: SkeletonProps): React.ReactElement {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
