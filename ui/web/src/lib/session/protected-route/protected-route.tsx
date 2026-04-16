import type { ReactElement, ReactNode } from 'react';
import { Button } from '@org/ui-primitives';
import { AuthLoadingState, UnauthenticatedState } from '../../auth/layout/auth-route-states';
import { useSession } from '../provider/session-provider';
import type { AuthenticatedLayoutProps, ProtectedRouteProps } from './protected-route.types';

export function ProtectedRoute({
  children,
  fallback,
  loadingFallback,
}: Readonly<ProtectedRouteProps>): ReactNode {
  const session = useSession();

  if (session.status === 'loading') {
    return loadingFallback ?? <AuthLoadingState />;
  }

  if (session.status !== 'authenticated') {
    return fallback ?? <UnauthenticatedState />;
  }

  return children;
}

export function AuthenticatedLayout({
  children,
  eyebrow = 'Ripples',
  title = 'Workspace',
}: Readonly<AuthenticatedLayoutProps>): ReactElement {
  const { logout, user } = useSession();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <p className="text-xs uppercase text-muted-foreground">{eyebrow}</p>
            <h1 className="truncate text-xl font-semibold tracking-normal">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              onClick={() => {
                void logout();
              }}
              variant="outline"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </main>
  );
}
