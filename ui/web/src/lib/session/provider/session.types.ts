import type { RipplesApiClient } from '@org/api-client';
import type { ReactNode } from 'react';
import type {
  AuthResponse,
  AuthUser,
  GoogleOAuthCallbackRequest,
  GoogleOAuthStartRequest,
  GoogleOAuthStartResponse,
  LoginManualRequest,
  RegisterManualRequest,
} from '@org/types';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface SessionState {
  readonly status: SessionStatus;
  readonly user?: AuthUser;
  readonly accessToken?: string;
  readonly error?: string;
}

export interface SessionContextValue extends SessionState {
  readonly getAuthorizationHeader: () => string | undefined;
  readonly refreshSession: () => Promise<AuthResponse | undefined>;
  readonly registerManual: (input: RegisterManualRequest) => Promise<AuthResponse>;
  readonly loginManual: (input: LoginManualRequest) => Promise<AuthResponse>;
  readonly logout: () => Promise<void>;
  readonly startGoogleOAuth: (input: GoogleOAuthStartRequest) => Promise<GoogleOAuthStartResponse>;
  readonly completeGoogleOAuth: (input: GoogleOAuthCallbackRequest) => Promise<AuthResponse>;
}

export interface AuthSessionControllerOptions {
  readonly apiBaseUrl?: string;
  readonly client?: RipplesApiClient;
  readonly refreshOnMount?: boolean;
}

export interface AuthProviderProps extends AuthSessionControllerOptions {
  readonly children: ReactNode;
}
