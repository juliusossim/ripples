import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { cn } from './utils';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>): ReactElement {
  return (
    <div
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>): ReactElement {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'h3'>): ReactElement {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-normal', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>): ReactElement {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>): ReactElement {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>): ReactElement {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
