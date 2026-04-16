import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfigService {
  readonly accessTokenTtlSeconds = this.readNumber('AUTH_ACCESS_TOKEN_TTL_SECONDS', 900);
  readonly refreshTokenTtlSeconds = this.readNumber(
    'AUTH_REFRESH_TOKEN_TTL_SECONDS',
    60 * 60 * 24 * 30,
  );
  readonly googleOAuthStateTtlSeconds = this.readNumber('GOOGLE_OAUTH_STATE_TTL_SECONDS', 600);
  readonly cookieSecure = this.readBoolean(
    'AUTH_COOKIE_SECURE',
    process.env['NODE_ENV'] === 'production',
  );
  readonly cookieSameSite = this.readSameSite('AUTH_COOKIE_SAME_SITE', 'lax');

  constructor() {
    if (this.cookieSameSite === 'none' && !this.cookieSecure) {
      throw new Error('AUTH_COOKIE_SAME_SITE=none requires AUTH_COOKIE_SECURE=true.');
    }
  }

  get allowedCorsOrigins(): string[] {
    const value = process.env['AUTH_CORS_ORIGINS'] ?? process.env['WEB_ORIGIN'];
    if (!value) {
      return ['http://localhost:4200'];
    }

    return value
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  get jwtSecret(): string {
    return this.readRequiredSecret(
      'AUTH_JWT_SECRET',
      'ripples-dev-auth-secret-change-me-before-production',
    );
  }

  get passwordPepper(): string {
    return this.readRequiredSecret(
      'AUTH_PASSWORD_PEPPER',
      'ripples-dev-password-pepper-change-me-before-production',
    );
  }

  get googleClientId(): string | undefined {
    return process.env['GOOGLE_CLIENT_ID'];
  }

  get googleClientSecret(): string | undefined {
    return process.env['GOOGLE_CLIENT_SECRET'];
  }

  private readNumber(key: string, fallback: number): number {
    const value = process.env[key];
    if (!value) {
      return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  private readBoolean(key: string, fallback: boolean): boolean {
    const value = process.env[key]?.toLowerCase();
    if (!value) {
      return fallback;
    }

    return value === 'true' || value === '1';
  }

  private readSameSite(
    key: string,
    fallback: 'lax' | 'strict' | 'none',
  ): 'lax' | 'strict' | 'none' {
    const value = process.env[key]?.toLowerCase();
    if (value === 'lax' || value === 'strict' || value === 'none') {
      return value;
    }

    return fallback;
  }

  private readRequiredSecret(key: string, developmentFallback: string): string {
    const value = process.env[key];
    if (value) {
      return value;
    }
    if (process.env['NODE_ENV'] === 'production') {
      throw new Error(`Missing required production secret: ${key}`);
    }

    return developmentFallback;
  }
}
