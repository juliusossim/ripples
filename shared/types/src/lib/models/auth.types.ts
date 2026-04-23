export type AuthProvider = 'manual' | 'google';

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: UserRole[];
  providers: AuthProvider[];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface AuthSession {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RegisterManualRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginManualRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface GoogleOAuthStartRequest {
  redirectUri: string;
}

export interface GoogleOAuthStartResponse {
  authorizationUrl: string;
  state: string;
  expiresAt: Date;
}

export interface GoogleOAuthCallbackRequest {
  code: string;
  state: string;
  redirectUri: string;
}
