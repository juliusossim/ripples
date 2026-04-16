import { AuthConfigService } from './auth-config.service';

describe('AuthConfigService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env['AUTH_COOKIE_SAME_SITE'];
    delete process.env['AUTH_COOKIE_SECURE'];
    delete process.env['AUTH_CORS_ORIGINS'];
    delete process.env['WEB_ORIGIN'];
    delete process.env['AUTH_ACCESS_TOKEN_TTL_SECONDS'];
    delete process.env['AUTH_REFRESH_TOKEN_TTL_SECONDS'];
    delete process.env['AUTH_JWT_SECRET'];
    delete process.env['AUTH_PASSWORD_PEPPER'];
    delete process.env['GOOGLE_CLIENT_ID'];
    delete process.env['GOOGLE_CLIENT_SECRET'];
    delete process.env['GOOGLE_OAUTH_STATE_TTL_SECONDS'];
    delete process.env['NODE_ENV'];
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses safe local defaults for development', () => {
    const config = new AuthConfigService();

    expect(config.accessTokenTtlSeconds).toBe(900);
    expect(config.allowedCorsOrigins).toEqual(['http://localhost:4200']);
    expect(config.cookieSameSite).toBe('lax');
    expect(config.cookieSecure).toBe(false);
  });

  it('parses comma-separated CORS origins', () => {
    process.env['AUTH_CORS_ORIGINS'] = 'https://app.example.com, https://admin.example.com';

    expect(new AuthConfigService().allowedCorsOrigins).toEqual([
      'https://app.example.com',
      'https://admin.example.com',
    ]);
  });

  it('uses WEB_ORIGIN when explicit CORS origins are not configured', () => {
    process.env['WEB_ORIGIN'] = 'https://web.example.com';

    expect(new AuthConfigService().allowedCorsOrigins).toEqual(['https://web.example.com']);
  });

  it('reads configured token and OAuth TTL values', () => {
    process.env['AUTH_ACCESS_TOKEN_TTL_SECONDS'] = '1200';
    process.env['AUTH_REFRESH_TOKEN_TTL_SECONDS'] = '86400';
    process.env['GOOGLE_OAUTH_STATE_TTL_SECONDS'] = '300';

    const config = new AuthConfigService();

    expect(config.accessTokenTtlSeconds).toBe(1200);
    expect(config.refreshTokenTtlSeconds).toBe(86400);
    expect(config.googleOAuthStateTtlSeconds).toBe(300);
  });

  it('falls back when numeric environment values are invalid', () => {
    process.env['AUTH_ACCESS_TOKEN_TTL_SECONDS'] = 'not-a-number';

    expect(new AuthConfigService().accessTokenTtlSeconds).toBe(900);
  });

  it('reads configured application secrets and Google client values', () => {
    process.env['AUTH_JWT_SECRET'] = 'jwt-secret';
    process.env['AUTH_PASSWORD_PEPPER'] = 'pepper';
    process.env['GOOGLE_CLIENT_ID'] = 'google-client-id';
    process.env['GOOGLE_CLIENT_SECRET'] = 'google-client-secret';

    const config = new AuthConfigService();

    expect(config.jwtSecret).toBe('jwt-secret');
    expect(config.passwordPepper).toBe('pepper');
    expect(config.googleClientId).toBe('google-client-id');
    expect(config.googleClientSecret).toBe('google-client-secret');
  });

  it.each(['true', '1'])('treats AUTH_COOKIE_SECURE=%s as true', (value) => {
    process.env['AUTH_COOKIE_SECURE'] = value;

    expect(new AuthConfigService().cookieSecure).toBe(true);
  });

  it('allows explicit insecure cookies outside SameSite none', () => {
    process.env['AUTH_COOKIE_SECURE'] = 'false';

    expect(new AuthConfigService().cookieSecure).toBe(false);
  });

  it('accepts strict SameSite cookies', () => {
    process.env['AUTH_COOKIE_SAME_SITE'] = 'strict';

    expect(new AuthConfigService().cookieSameSite).toBe('strict');
  });

  it('requires secure cookies when SameSite is none', () => {
    process.env['AUTH_COOKIE_SAME_SITE'] = 'none';
    process.env['AUTH_COOKIE_SECURE'] = 'false';

    expect(() => new AuthConfigService()).toThrow(
      'AUTH_COOKIE_SAME_SITE=none requires AUTH_COOKIE_SECURE=true.',
    );
  });

  it('requires production secrets', () => {
    process.env['NODE_ENV'] = 'production';

    expect(() => new AuthConfigService().jwtSecret).toThrow(
      'Missing required production secret: AUTH_JWT_SECRET',
    );
  });
});
