import { createContext, useContext, type ReactElement } from 'react';
import { useAuthSessionController } from './use-auth-session-controller';
import type {
  AuthProviderProps,
  SessionContextValue,
  SessionState,
  SessionStatus,
} from './session.types';

export type { SessionContextValue, SessionState, SessionStatus };

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function AuthProvider({
  apiBaseUrl,
  children,
  client,
  refreshOnMount,
}: Readonly<AuthProviderProps>): ReactElement {
  const value = useAuthSessionController({
    apiBaseUrl,
    client,
    refreshOnMount,
  });

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside AuthProvider.');
  }

  return value;
}
