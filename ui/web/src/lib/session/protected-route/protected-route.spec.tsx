import { render, screen } from '@testing-library/react';
import { useEffect, type ReactElement } from 'react';

import { createAuthClientStub } from '../../auth/testing/auth-test-fixtures';
import { AuthenticatedLayout, ProtectedRoute } from './protected-route';
import { AuthProvider, useSession } from '../provider/session-provider';

describe('ProtectedRoute', () => {
  it('renders the fallback for unauthenticated sessions', () => {
    render(
      <AuthProvider client={createAuthClientStub()} refreshOnMount={false}>
        <ProtectedRoute fallback={<p>Sign in first</p>}>
          <p>Protected workspace</p>
        </ProtectedRoute>
      </AuthProvider>,
    );

    expect(screen.getByText('Sign in first')).toBeTruthy();
  });

  it('renders protected content after authentication', async () => {
    render(
      <AuthProvider client={createAuthClientStub()} refreshOnMount={false}>
        <LoginOnMount />
        <ProtectedRoute>
          <AuthenticatedLayout title="Feed workspace">
            <p>Protected workspace</p>
          </AuthenticatedLayout>
        </ProtectedRoute>
      </AuthProvider>,
    );

    expect(await screen.findByText('Protected workspace')).toBeTruthy();
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
  });
});

function LoginOnMount(): ReactElement | null {
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void session.loginManual({
        email: 'ada@example.com',
        password: 'correct horse battery staple',
      });
    }
  }, [session]);

  return null;
}
