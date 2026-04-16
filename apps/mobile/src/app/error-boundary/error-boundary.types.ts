import type { ReactNode } from 'react';

export interface MobileErrorBoundaryProps {
  readonly children: ReactNode;
}

export interface MobileErrorBoundaryState {
  readonly error?: Error;
}
