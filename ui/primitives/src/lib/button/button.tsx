import type { ReactElement } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonVariants } from './button.variants';
import type { ButtonProps } from './button.types';

export function Button({
  asChild = false,
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ButtonProps): ReactElement {
  if (asChild) {
    return <Slot className={buttonVariants({ variant, size, className })} {...props} />;
  }

  if (type === 'submit') {
    return (
      <button className={buttonVariants({ variant, size, className })} type="submit" {...props} />
    );
  }

  if (type === 'reset') {
    return (
      <button className={buttonVariants({ variant, size, className })} type="reset" {...props} />
    );
  }

  return (
    <button className={buttonVariants({ variant, size, className })} type="button" {...props} />
  );
}
