import { Injectable, UnauthorizedException } from '@nestjs/common';
import type {
  AuthTokens,
  AuthUser,
  GoogleOAuthStartResponse,
  LoginManualRequest,
  RegisterManualRequest,
} from '@org/types';
import type { AuthSessionResult } from './auth.types';
import { GoogleOAuthService } from './google/google-oauth.service';
import { SessionsRepository } from './repositories/sessions.repository';
import { UsersRepository } from './repositories/users.repository';
import { AuthConfigService } from './services/auth-config.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: AuthConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

  async registerManual(input: RegisterManualRequest): Promise<AuthSessionResult> {
    const password = await this.passwordService.hash(input.password);
    const user = await this.usersRepository.createManual({
      email: input.email,
      fullName: input.fullName,
      passwordHash: password.hash,
      passwordSalt: password.salt,
    });

    return this.createAuthResponse(user.id);
  }

  async loginManual(input: LoginManualRequest): Promise<AuthSessionResult> {
    const user = await this.usersRepository.findByEmail(input.email);
    if (!user || !user.passwordHash || !user.passwordSalt) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    const passwordMatches = await this.passwordService.verify(
      input.password,
      user.passwordSalt,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    return this.createAuthResponse(user.id);
  }

  startGoogleOAuth(redirectUri: string): Promise<GoogleOAuthStartResponse> {
    return this.googleOAuthService.start(redirectUri);
  }

  async completeGoogleOAuth(
    code: string,
    state: string,
    redirectUri: string,
  ): Promise<AuthSessionResult> {
    const identity = await this.googleOAuthService.complete(code, state, redirectUri);
    const user = await this.usersRepository.upsertGoogle({
      email: identity.email,
      fullName: identity.fullName,
      googleSubject: identity.subject,
      avatarUrl: identity.avatarUrl,
      emailVerified: identity.emailVerified,
    });

    return this.createAuthResponse(user.id);
  }

  async refresh(refreshToken: string): Promise<AuthSessionResult> {
    const refreshTokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const session = await this.sessionsRepository.findActiveByRefreshTokenHash(refreshTokenHash);
    if (!session) {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    await this.sessionsRepository.revoke(session.id);
    return this.createAuthResponse(session.userId);
  }

  async logout(refreshToken: string): Promise<{ success: true }> {
    const refreshTokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const session = await this.sessionsRepository.findActiveByRefreshTokenHash(refreshTokenHash);
    if (session) {
      await this.sessionsRepository.revoke(session.id);
    }

    return { success: true };
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Authenticated user was not found.');
    }

    return this.usersRepository.toPublicUser(user);
  }

  verifyAccessToken(accessToken: string): ReturnType<TokenService['verifyAccessToken']> {
    return this.tokenService.verifyAccessToken(accessToken);
  }

  private async createAuthResponse(userId: string): Promise<AuthSessionResult> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Authenticated user was not found.');
    }

    const session = await this.createSessionTokens(user);
    return {
      response: {
        user: this.usersRepository.toPublicUser(user),
        tokens: session.tokens,
      },
      refreshToken: session.refreshToken,
      refreshTokenExpiresAt: session.refreshTokenExpiresAt,
    };
  }

  private async createSessionTokens(user: {
    id: string;
    email: string;
    roles: AuthUser['roles'];
  }): Promise<{ tokens: AuthTokens; refreshToken: string; refreshTokenExpiresAt: Date }> {
    const tokens = this.tokenService.issueTokens(user);
    const refreshToken = tokens.refreshToken;
    if (!refreshToken) {
      throw new Error('TokenService did not issue a refresh token.');
    }
    const refreshTokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + this.config.refreshTokenTtlSeconds * 1000);
    await this.sessionsRepository.create(user.id, refreshTokenHash, refreshTokenExpiresAt);

    return {
      tokens: {
        accessToken: tokens.accessToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn,
      },
      refreshToken,
      refreshTokenExpiresAt,
    };
  }
}
