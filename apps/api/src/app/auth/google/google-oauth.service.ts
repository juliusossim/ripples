import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createHash,
  createPublicKey,
  createVerify,
  randomBytes,
  type JsonWebKey,
} from 'node:crypto';
import type { GoogleOAuthStartResponse } from '@org/types';
import { OAuthStateRepository } from '../repositories/oauth-state.repository';
import { AuthConfigService } from '../services/auth-config.service';

interface GoogleTokenResponse {
  id_token: string;
}

export interface GoogleIdentity {
  subject: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

interface GoogleJwk extends JsonWebKey {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
}

interface GoogleJwksResponse {
  keys: GoogleJwk[];
}

interface GoogleIdTokenHeader {
  alg: 'RS256';
  kid: string;
  typ?: string;
}

interface GoogleIdTokenPayload {
  iss: string;
  aud: string;
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  exp: number;
}

@Injectable()
export class GoogleOAuthService {
  private jwks?: { keys: GoogleJwk[]; expiresAt: number };

  constructor(
    private readonly config: AuthConfigService,
    private readonly oauthStateRepository: OAuthStateRepository,
  ) {}

  async start(redirectUri: string): Promise<GoogleOAuthStartResponse> {
    this.assertConfigured();
    const state = randomBytes(32).toString('base64url');
    const codeVerifier = randomBytes(48).toString('base64url');
    const expiresAt = new Date(Date.now() + this.config.googleOAuthStateTtlSeconds * 1000);
    const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    authorizationUrl.searchParams.set('client_id', this.config.googleClientId ?? '');
    authorizationUrl.searchParams.set('redirect_uri', redirectUri);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'openid email profile');
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('code_challenge', this.createCodeChallenge(codeVerifier));
    authorizationUrl.searchParams.set('code_challenge_method', 'S256');
    authorizationUrl.searchParams.set('access_type', 'offline');
    authorizationUrl.searchParams.set('prompt', 'select_account');

    await this.oauthStateRepository.create({
      state,
      codeVerifier,
      redirectUri,
      provider: 'google',
      expiresAt,
      createdAt: new Date(),
    });

    return {
      authorizationUrl: authorizationUrl.toString(),
      state,
      expiresAt,
    };
  }

  async complete(code: string, state: string, redirectUri: string): Promise<GoogleIdentity> {
    this.assertConfigured();
    const stateRecord = await this.oauthStateRepository.consume(state);
    if (!stateRecord || stateRecord.redirectUri !== redirectUri) {
      throw new BadRequestException('Google OAuth state is invalid or expired.');
    }

    const tokenResponse = await this.exchangeCode(code, redirectUri, stateRecord.codeVerifier);
    const payload = await this.verifyIdToken(tokenResponse.id_token);

    return {
      subject: payload.sub,
      email: payload.email,
      fullName: payload.name ?? payload.email,
      avatarUrl: payload.picture,
      emailVerified: payload.email_verified === true,
    };
  }

  private async exchangeCode(
    code: string,
    redirectUri: string,
    codeVerifier: string,
  ): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.googleClientId ?? '',
        client_secret: this.config.googleClientSecret ?? '',
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Google OAuth code exchange failed.');
    }

    const payload = (await response.json()) as unknown;
    if (!this.isGoogleTokenResponse(payload)) {
      throw new UnauthorizedException('Google OAuth token response was invalid.');
    }

    return payload;
  }

  private async verifyIdToken(idToken: string): Promise<GoogleIdTokenPayload> {
    const [encodedHeader, encodedPayload, signature, extra] = idToken.split('.');
    if (!encodedHeader || !encodedPayload || !signature || extra) {
      throw new UnauthorizedException('Google ID token is malformed.');
    }

    const header = this.parseHeader(encodedHeader);
    const payload = this.parsePayload(encodedPayload);
    const jwk = (await this.getJwks()).find((key) => key.kid === header.kid);
    if (!jwk) {
      throw new UnauthorizedException('Google ID token signing key was not found.');
    }

    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${encodedHeader}.${encodedPayload}`);
    verifier.end();
    const verified = verifier.verify(
      createPublicKey({ key: jwk, format: 'jwk' }),
      signature,
      'base64url',
    );

    if (!verified) {
      throw new UnauthorizedException('Google ID token signature is invalid.');
    }
    if (!['https://accounts.google.com', 'accounts.google.com'].includes(payload.iss)) {
      throw new UnauthorizedException('Google ID token issuer is invalid.');
    }
    if (payload.aud !== this.config.googleClientId) {
      throw new UnauthorizedException('Google ID token audience is invalid.');
    }
    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Google ID token has expired.');
    }

    return payload;
  }

  private async getJwks(): Promise<GoogleJwk[]> {
    if (this.jwks && this.jwks.expiresAt > Date.now()) {
      return this.jwks.keys;
    }

    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!response.ok) {
      throw new ServiceUnavailableException('Google signing keys are unavailable.');
    }

    const payload = (await response.json()) as unknown;
    if (!this.isGoogleJwksResponse(payload)) {
      throw new ServiceUnavailableException('Google signing keys response was invalid.');
    }

    this.jwks = {
      keys: payload.keys,
      expiresAt: Date.now() + 60 * 60 * 1000,
    };

    return payload.keys;
  }

  private createCodeChallenge(codeVerifier: string): string {
    return createHash('sha256').update(codeVerifier).digest('base64url');
  }

  private parseHeader(encodedHeader: string): GoogleIdTokenHeader {
    const parsed = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8')) as unknown;
    if (!this.isGoogleIdTokenHeader(parsed)) {
      throw new UnauthorizedException('Google ID token header is invalid.');
    }

    return parsed;
  }

  private parsePayload(encodedPayload: string): GoogleIdTokenPayload {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as unknown;
    if (!this.isGoogleIdTokenPayload(parsed)) {
      throw new UnauthorizedException('Google ID token payload is invalid.');
    }

    return parsed;
  }

  private assertConfigured(): void {
    if (!this.config.googleClientId || !this.config.googleClientSecret) {
      throw new ServiceUnavailableException(
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
      );
    }
  }

  private isGoogleTokenResponse(value: unknown): value is GoogleTokenResponse {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as Record<string, unknown>;

    return typeof record['id_token'] === 'string';
  }

  private isGoogleJwksResponse(value: unknown): value is GoogleJwksResponse {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const keys = (value as Record<string, unknown>).keys;

    return Array.isArray(keys) && keys.every((key) => this.isGoogleJwk(key));
  }

  private isGoogleJwk(value: unknown): value is GoogleJwk {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as Record<string, unknown>;

    return (
      typeof record.kid === 'string' &&
      typeof record.kty === 'string' &&
      typeof record.alg === 'string' &&
      typeof record.use === 'string' &&
      typeof record.n === 'string' &&
      typeof record.e === 'string'
    );
  }

  private isGoogleIdTokenHeader(value: unknown): value is GoogleIdTokenHeader {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as Record<string, unknown>;

    return record.alg === 'RS256' && typeof record.kid === 'string';
  }

  private isGoogleIdTokenPayload(value: unknown): value is GoogleIdTokenPayload {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as Record<string, unknown>;

    return (
      typeof record.iss === 'string' &&
      typeof record.aud === 'string' &&
      typeof record.sub === 'string' &&
      typeof record.email === 'string' &&
      typeof record.exp === 'number'
    );
  }
}
