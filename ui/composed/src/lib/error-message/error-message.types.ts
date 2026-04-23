import type { ReactNode } from 'react';

export type ErrorMessageProps = Readonly<{
  message?: string;
  imageAlt?: string;
  imageSrc?: string;
  className?: string;
  children?: ReactNode;
  onRetry?: () => void;
  onGoBack?: () => void;
}>;
