import { UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import type { AuthConfigService } from './auth-config.service';
import { TokenService } from './token.service';

interface TestJwtPayload {
  email?: string;
  exp?: number;
  iat?: number;
  roles?: string[];
  sub?: string;
  typ?: string;
}

describe('TokenService', () => {
  it('issues access and refresh tokens', () => {
    const service = new TokenService(createConfig());

    const tokens = service.issueTokens({
      id: 'user_1',
      email: 'ada@example.com',
      roles: ['user'],
    });

    expect(tokens.accessToken.split('.')).toHaveLength(3);
    expect(tokens.refreshToken).toBeTruthy();
    expect(tokens.tokenType).toBe('Bearer');
    expect(tokens.expiresIn).toBe(900);
  });

  it('verifies access tokens into authenticated users', () => {
    const service = new TokenService(createConfig());
    const tokens = service.issueTokens({
      id: 'user_1',
      email: 'ada@example.com',
      roles: ['admin'],
    });

    expect(service.verifyAccessToken(tokens.accessToken)).toEqual({
      id: 'user_1',
      email: 'ada@example.com',
      roles: ['admin'],
    });
  });

  it('rejects tampered access tokens', () => {
    const service = new TokenService(createConfig());
    const tokens = service.issueTokens({
      id: 'user_1',
      email: 'ada@example.com',
      roles: ['user'],
    });

    expect(() => service.verifyAccessToken(`${tokens.accessToken}tampered`)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects malformed access tokens', () => {
    const service = new TokenService(createConfig());

    expect(() => service.verifyAccessToken('malformed-token')).toThrow(UnauthorizedException);
  });

  it('rejects expired access tokens', () => {
    const service = new TokenService(createConfig());
    const expiredToken = createAccessToken({
      sub: 'user_1',
      email: 'ada@example.com',
      roles: ['user'],
      typ: 'access',
      iat: currentUnixTime() - 120,
      exp: currentUnixTime() - 60,
    });

    expect(() => service.verifyAccessToken(expiredToken)).toThrow(UnauthorizedException);
  });

  it('rejects access tokens with invalid payloads', () => {
    const service = new TokenService(createConfig());
    const invalidPayloadToken = createAccessToken({
      sub: 'user_1',
      email: 'ada@example.com',
      roles: ['owner'],
      typ: 'access',
      iat: currentUnixTime(),
      exp: currentUnixTime() + 60,
    });

    expect(() => service.verifyAccessToken(invalidPayloadToken)).toThrow(UnauthorizedException);
  });

  it('hashes refresh tokens deterministically without exposing the token', () => {
    const service = new TokenService(createConfig());

    expect(service.hashRefreshToken('refresh-token')).toBe(
      service.hashRefreshToken('refresh-token'),
    );
    expect(service.hashRefreshToken('refresh-token')).not.toBe('refresh-token');
  });
});

function createConfig(): AuthConfigService {
  return {
    accessTokenTtlSeconds: 900,
    jwtSecret: 'test-secret',
  } as AuthConfigService;
}

function createAccessToken(payload: TestJwtPayload): string {
  const encodedHeader = encodeJson({ alg: 'HS256', typ: 'JWT' });
  const encodedPayload = encodeJson(payload);
  const signature = createHmac('sha256', 'test-secret')
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function encodeJson(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function currentUnixTime(): number {
  return Math.floor(Date.now() / 1000);
}
