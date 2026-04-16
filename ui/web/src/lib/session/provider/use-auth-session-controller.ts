import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRipplesApiClient } from '@org/api-client';
import type {
  AuthResponse,
  GoogleOAuthCallbackRequest,
  GoogleOAuthStartRequest,
  GoogleOAuthStartResponse,
  LoginManualRequest,
  RegisterManualRequest,
} from '@org/types';
import { authUserQueryKey, useOptionalRipplesApi } from '@org/data';
import type {
  AuthSessionControllerOptions,
  SessionContextValue,
  SessionState,
} from './session.types';

export function useAuthSessionController({
  apiBaseUrl,
  client: providedClient,
  refreshOnMount = true,
}: Readonly<AuthSessionControllerOptions>): SessionContextValue {
  const api = useOptionalRipplesApi();
  const client = useMemo(
    () => providedClient ?? api?.client ?? createRipplesApiClient({ baseUrl: apiBaseUrl }),
    [api?.client, apiBaseUrl, providedClient],
  );
  const queryClient = api?.queryClient;
  const [session, setSession] = useState<SessionState>({
    status: refreshOnMount ? 'loading' : 'unauthenticated',
  });
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearRefreshTimer = useCallback((): void => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = undefined;
    }
  }, []);

  const clearSession = useCallback((): void => {
    clearRefreshTimer();
    queryClient?.removeQueries({ queryKey: authUserQueryKey });
    setSession({ status: 'unauthenticated' });
  }, [clearRefreshTimer, queryClient]);

  const establishSession = useCallback(
    async (response: AuthResponse): Promise<AuthResponse> => {
      clearRefreshTimer();
      const user = queryClient
        ? await queryClient.fetchQuery({
            queryKey: authUserQueryKey,
            queryFn: () => client.getMe(response.tokens.accessToken),
          })
        : await client.getMe(response.tokens.accessToken);

      setSession({
        status: 'authenticated',
        user,
        accessToken: response.tokens.accessToken,
      });
      refreshTimer.current = setTimeout(
        () => {
          void client.refresh().then(establishSession).catch(clearSession);
        },
        Math.max((response.tokens.expiresIn - 60) * 1000, 30_000),
      );

      return { ...response, user };
    },
    [clearRefreshTimer, clearSession, client, queryClient],
  );

  const refreshSession = useCallback(async (): Promise<AuthResponse | undefined> => {
    try {
      return await establishSession(await client.refresh());
    } catch (error) {
      clearRefreshTimer();
      queryClient?.removeQueries({ queryKey: authUserQueryKey });
      setSession({ status: 'unauthenticated', error: readSessionError(error) });
      return undefined;
    }
  }, [clearRefreshTimer, client, establishSession, queryClient]);

  useEffect(() => {
    if (!refreshOnMount) {
      return undefined;
    }

    void refreshSession();
    return clearRefreshTimer;
  }, [clearRefreshTimer, refreshOnMount, refreshSession]);

  const completeGoogleOAuth = useCallback(
    (input: GoogleOAuthCallbackRequest): Promise<AuthResponse> =>
      establishSessionFrom(() => client.completeGoogleOAuth(input), establishSession),
    [client, establishSession],
  );
  const getAuthorizationHeader = useCallback(
    (): string | undefined => (session.accessToken ? `Bearer ${session.accessToken}` : undefined),
    [session.accessToken],
  );
  const loginManual = useCallback(
    (input: LoginManualRequest): Promise<AuthResponse> =>
      establishSessionFrom(() => client.loginManual(input), establishSession),
    [client, establishSession],
  );
  const logout = useCallback(async (): Promise<void> => {
    clearRefreshTimer();
    await client.logout();
    clearSession();
  }, [clearRefreshTimer, clearSession, client]);
  const registerManual = useCallback(
    (input: RegisterManualRequest): Promise<AuthResponse> =>
      establishSessionFrom(() => client.registerManual(input), establishSession),
    [client, establishSession],
  );
  const startGoogleOAuth = useCallback(
    (input: GoogleOAuthStartRequest): Promise<GoogleOAuthStartResponse> =>
      client.startGoogleOAuth(input),
    [client],
  );

  return useMemo<SessionContextValue>(
    () => ({
      ...session,
      completeGoogleOAuth,
      getAuthorizationHeader,
      loginManual,
      logout,
      refreshSession,
      registerManual,
      startGoogleOAuth,
    }),
    [
      completeGoogleOAuth,
      getAuthorizationHeader,
      loginManual,
      logout,
      refreshSession,
      registerManual,
      session,
      startGoogleOAuth,
    ],
  );
}

async function establishSessionFrom(
  request: () => Promise<AuthResponse>,
  establishSession: (response: AuthResponse) => Promise<AuthResponse>,
): Promise<AuthResponse> {
  return establishSession(await request());
}

function readSessionError(error: unknown): string {
  return error instanceof Error ? error.message : 'Session refresh failed.';
}
