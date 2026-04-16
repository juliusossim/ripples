import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AuthTokens, UserRole } from '@org/types';
import type { AccessTokenClaims, AuthenticatedUser } from '../auth.types';
import { AuthConfigService } from './auth-config.service';

interface JwtPayload extends AccessTokenClaims {
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly config: AuthConfigService) {}

  issueTokens(user: { id: string; email: string; roles: UserRole[] }): AuthTokens {
    return {
      accessToken: this.signAccessToken(user),
      refreshToken: randomBytes(48).toString('base64url'),
      tokenType: 'Bearer',
      expiresIn: this.config.accessTokenTtlSeconds,
    };
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    const payload = this.verifyJwt(token);

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }

  hashRefreshToken(refreshToken: string): string {
    return createHmac('sha256', this.config.jwtSecret).update(refreshToken).digest('base64url');
  }

  private signAccessToken(user: { id: string; email: string; roles: UserRole[] }): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      typ: 'access',
      iat: now,
      exp: now + this.config.accessTokenTtlSeconds,
    };
    const encodedHeader = this.encodeJson({ alg: 'HS256', typ: 'JWT' });
    const encodedPayload = this.encodeJson(payload);
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private verifyJwt(token: string): JwtPayload {
    const [encodedHeader, encodedPayload, signature, extra] = token.split('.');
    if (!encodedHeader || !encodedPayload || !signature || extra) {
      throw new UnauthorizedException('Malformed access token.');
    }

    const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);
    const actual = Buffer.from(signature, 'base64url');
    const expected = Buffer.from(expectedSignature, 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      throw new UnauthorizedException('Invalid access token signature.');
    }

    const payload = this.parsePayload(encodedPayload);
    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Access token has expired.');
    }

    return payload;
  }

  private parsePayload(encodedPayload: string): JwtPayload {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as unknown;
    if (!this.isJwtPayload(parsed)) {
      throw new UnauthorizedException('Access token payload is invalid.');
    }

    return parsed;
  }

  private isJwtPayload(value: unknown): value is JwtPayload {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as Record<string, unknown>;

    return (
      typeof record.sub === 'string' &&
      typeof record.email === 'string' &&
      Array.isArray(record.roles) &&
      record.roles.every((role) => role === 'user' || role === 'admin') &&
      record.typ === 'access' &&
      typeof record.iat === 'number' &&
      typeof record.exp === 'number'
    );
  }

  private encodeJson(value: object): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }

  private sign(value: string): string {
    return createHmac('sha256', this.config.jwtSecret).update(value).digest('base64url');
  }
}
