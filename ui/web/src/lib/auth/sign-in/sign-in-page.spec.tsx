import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { RipplesApiClient } from '@org/api-client';
import { vi } from 'vitest';

import { createAuthClientStub, testAuthResponse } from '../testing/auth-test-fixtures';
import { apiUnavailableMessage } from '../google/auth-page-utils';
import SignInPage from './sign-in-page';
import { AuthProvider } from '../../session/provider/session-provider';

describe('SignInPage', () => {
  it('renders google and manual sign-in options', () => {
    renderSignInPage();

    expect(screen.getByText('Continue with Google')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });

  it('uses the session contract for manual sign in', async () => {
    let loginEmail: string | undefined;
    const client = createAuthClientStub({
      loginManual: async (input) => {
        loginEmail = input.email;
        return testAuthResponse;
      },
    });

    renderSignInPage(client);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct horse battery staple' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(loginEmail).toBe('ada@example.com'));
    expect(await screen.findByText('Welcome back, Ada Lovelace.')).toBeTruthy();
  });

  it('shows a friendly API unavailable message when session restoration fails on boot', async () => {
    const client = createAuthClientStub({
      refresh: async () => {
        throw new TypeError('Failed to fetch');
      },
    });

    renderSignInPage(client, true);

    expect(await screen.findByText(apiUnavailableMessage)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry connection' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Check API health' })).toBeTruthy();
  });

  it('checks API health from the recovery banner', async () => {
    const client = createAuthClientStub({
      refresh: async () => {
        throw new TypeError('Failed to fetch');
      },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
      })),
    );

    renderSignInPage(client, true);

    expect(await screen.findByText(apiUnavailableMessage)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Check API health' }));

    expect(
      await screen.findByText(
        'API is reachable again. Retry the connection to restore your session.',
      ),
    ).toBeTruthy();
  });
});

function renderSignInPage(
  client: RipplesApiClient = createAuthClientStub(),
  refreshOnMount = false,
): ReturnType<typeof render> {
  return render(
    <AuthProvider client={client} refreshOnMount={refreshOnMount}>
      <SignInPage />
    </AuthProvider>,
  );
}
