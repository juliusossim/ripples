import type { ReactNode } from 'react';

export interface ProtectedRouteProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
  readonly loadingFallback?: ReactNode;
}

export interface AuthenticatedLayoutProps {
  readonly children: ReactNode;
  readonly eyebrow?: string;
  readonly title?: string;
}
