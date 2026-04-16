import type { ReactNode } from 'react';

export interface WebErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

export interface WebErrorBoundaryState {
  readonly error?: Error;
}

export interface DefaultWebErrorFallbackProps {
  readonly onReset: () => void;
}
