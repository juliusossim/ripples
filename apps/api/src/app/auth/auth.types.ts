import type { AuthProvider, AuthResponse, AuthUser, UserRole } from '@org/types';

export interface StoredUser extends AuthUser {
  passwordHash?: string;
  passwordSalt?: string;
  googleSubject?: string;
}

export interface CreateManualUserInput {
  email: string;
  fullName: string;
  passwordHash: string;
  passwordSalt: string;
}

export interface UpsertGoogleUserInput {
  email: string;
  fullName: string;
  googleSubject: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

export interface AccessTokenClaims {
  sub: string;
  email: string;
  roles: UserRole[];
  typ: 'access';
}

export interface AuthenticatedRequest {
  user?: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: UserRole[];
}

export interface AuthSessionResult {
  response: AuthResponse;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export interface CookieReader {
  headers: {
    cookie?: string | string[];
  };
}

export interface HeaderWriter {
  setHeader(name: string, value: string | string[]): void;
}

export interface OAuthStateRecord {
  state: string;
  codeVerifier: string;
  redirectUri: string;
  provider: Extract<AuthProvider, 'google'>;
  expiresAt: Date;
  createdAt: Date;
}
