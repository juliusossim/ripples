import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import { authUserQueryKey, createRipplesQueryClient, RipplesApiProvider } from '@org/data';
import { createAuthClientStub, testAuthResponse } from '../../auth/testing/auth-test-fixtures';
import { AuthProvider, useSession } from './session-provider';

describe('AuthProvider', () => {
  it('refreshes the session on boot through the provided client', async () => {
    let refreshCalls = 0;
    let getMeToken: string | undefined;
    const client = createAuthClientStub({
      refresh: async () => {
        refreshCalls += 1;
        return testAuthResponse;
      },
      getMe: async (accessToken) => {
        getMeToken = accessToken;
        return {
          ...testAuthResponse.user,
          fullName: 'Ada Profile',
        };
      },
    });

    render(
      <AuthProvider client={client}>
        <SessionProbe />
      </AuthProvider>,
    );

    expect(await screen.findByText('authenticated')).toBeTruthy();
    expect(screen.getByText('Ada Profile')).toBeTruthy();
    expect(screen.getByText('Bearer access-token')).toBeTruthy();
    expect(refreshCalls).toBe(1);
    expect(getMeToken).toBe('access-token');
  });

  it('keeps the access token in memory after manual registration', async () => {
    const client = createAuthClientStub({
      registerManual: async () => testAuthResponse,
    });

    render(
      <AuthProvider client={client} refreshOnMount={false}>
        <RegistrationProbe />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'register' }));

    expect(await screen.findByText('authenticated')).toBeTruthy();
    expect(screen.getByText('Bearer access-token')).toBeTruthy();
  });

  it('stores the hydrated user in the TanStack Query cache', async () => {
    const queryClient = createRipplesQueryClient();
    const client = createAuthClientStub({
      getMe: async () => ({
        ...testAuthResponse.user,
        fullName: 'Ada Cached',
      }),
    });

    render(
      <RipplesApiProvider client={client} queryClient={queryClient}>
        <AuthProvider>
          <SessionProbe />
        </AuthProvider>
      </RipplesApiProvider>,
    );

    expect(await screen.findByText('Ada Cached')).toBeTruthy();
    expect(queryClient.getQueryData(authUserQueryKey)).toEqual({
      ...testAuthResponse.user,
      fullName: 'Ada Cached',
    });
  });
});

function SessionProbe(): ReactElement {
  const session = useSession();

  return (
    <div>
      <p>{session.status}</p>
      <p>{session.user?.fullName}</p>
      <p>{session.getAuthorizationHeader()}</p>
    </div>
  );
}

function RegistrationProbe(): ReactElement {
  const session = useSession();

  return (
    <div>
      <p>{session.status}</p>
      <p>{session.getAuthorizationHeader()}</p>
      <button
        onClick={() => {
          void session.registerManual({
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
            password: 'correct horse battery staple',
          });
        }}
        type="button"
      >
        register
      </button>
    </div>
  );
}
