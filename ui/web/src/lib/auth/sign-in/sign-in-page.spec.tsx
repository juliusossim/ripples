import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { RipplesApiClient } from '@org/api-client';

import { createAuthClientStub, testAuthResponse } from '../testing/auth-test-fixtures';
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
});

function renderSignInPage(
  client: RipplesApiClient = createAuthClientStub(),
): ReturnType<typeof render> {
  return render(
    <AuthProvider client={client} refreshOnMount={false}>
      <SignInPage />
    </AuthProvider>,
  );
}
