import { UnauthorizedException } from '@nestjs/common';
import type { AuthResponse, AuthSession, AuthUser } from '@org/types';
import { AuthService } from './auth.service';
import type { StoredUser } from './auth.types';
import type { GoogleOAuthService } from './google/google-oauth.service';
import type { SessionsRepository } from './repositories/sessions.repository';
import type { UsersRepository } from './repositories/users.repository';
import type { AuthConfigService } from './services/auth-config.service';
import type { PasswordService } from './services/password.service';
import type { TokenService } from './services/token.service';

const storedUser: StoredUser = {
  id: 'user_1',
  email: 'ada@example.com',
  fullName: 'Ada Lovelace',
  roles: ['user'],
  providers: ['manual'],
  emailVerified: false,
  passwordHash: 'hashed-password',
  passwordSalt: 'salt',
  createdAt: new Date('2026-04-15T00:00:00.000Z'),
  updatedAt: new Date('2026-04-15T00:00:00.000Z'),
};

const publicUser: AuthUser = {
  id: storedUser.id,
  email: storedUser.email,
  fullName: storedUser.fullName,
  roles: storedUser.roles,
  providers: storedUser.providers,
  emailVerified: storedUser.emailVerified,
  createdAt: storedUser.createdAt,
  updatedAt: storedUser.updatedAt,
};

describe('AuthService', () => {
  it('registers manual users and returns web-safe auth tokens', async () => {
    const fixture = createFixture();

    const result = await fixture.service.registerManual({
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      password: 'Correct1!',
    });

    expect(fixture.passwordService.hash).toHaveBeenCalledWith('Correct1!');
    expect(fixture.usersRepository.createManual).toHaveBeenCalledWith({
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      passwordHash: 'hashed-password',
      passwordSalt: 'salt',
    });
    expect(result.response).toEqual(expectedAuthResponse());
    expect(result.refreshToken).toBe('refresh-token');
  });

  it('rejects manual login when the password does not match', async () => {
    const fixture = createFixture();
    fixture.passwordService.verify.mockResolvedValue(false);

    await expect(
      fixture.service.loginManual({
        email: 'ada@example.com',
        password: 'Wrong1!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('logs in manual users with valid credentials', async () => {
    const fixture = createFixture();

    const result = await fixture.service.loginManual({
      email: 'ada@example.com',
      password: 'Correct1!',
    });

    expect(fixture.usersRepository.findByEmail).toHaveBeenCalledWith('ada@example.com');
    expect(fixture.passwordService.verify).toHaveBeenCalledWith(
      'Correct1!',
      storedUser.passwordSalt,
      storedUser.passwordHash,
    );
    expect(result).toEqual({
      response: expectedAuthResponse(),
      refreshToken: 'refresh-token',
      refreshTokenExpiresAt: expect.any(Date) as Date,
    });
  });

  it('rejects manual login when the user cannot be found', async () => {
    const fixture = createFixture();
    fixture.usersRepository.findByEmail.mockResolvedValue(undefined);

    await expect(
      fixture.service.loginManual({
        email: 'missing@example.com',
        password: 'Correct1!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(fixture.passwordService.verify).not.toHaveBeenCalled();
  });

  it('starts Google OAuth through the OAuth service', async () => {
    const fixture = createFixture();

    await expect(
      fixture.service.startGoogleOAuth('http://localhost:4200/auth/google'),
    ).resolves.toEqual({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      state: 'state',
      expiresAt: new Date('2026-04-15T00:10:00.000Z'),
    });
    expect(fixture.googleOAuthService.start).toHaveBeenCalledWith(
      'http://localhost:4200/auth/google',
    );
  });

  it('completes Google OAuth and creates an application session', async () => {
    const fixture = createFixture();

    const result = await fixture.service.completeGoogleOAuth(
      'code',
      'state',
      'http://localhost:4200/auth/google',
    );

    expect(fixture.googleOAuthService.complete).toHaveBeenCalledWith(
      'code',
      'state',
      'http://localhost:4200/auth/google',
    );
    expect(fixture.usersRepository.upsertGoogle).toHaveBeenCalledWith({
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      googleSubject: 'google-subject',
      avatarUrl: undefined,
      emailVerified: true,
    });
    expect(result.response).toEqual(expectedAuthResponse());
  });

  it('rotates refresh sessions', async () => {
    const fixture = createFixture();

    const result = await fixture.service.refresh('refresh-token');

    expect(fixture.sessionsRepository.findActiveByRefreshTokenHash).toHaveBeenCalledWith(
      'refresh-hash',
    );
    expect(fixture.sessionsRepository.revoke).toHaveBeenCalledWith('session_1');
    expect(result.response.tokens.accessToken).toBe('access-token');
  });

  it('rejects refresh when the session is missing', async () => {
    const fixture = createFixture();
    fixture.sessionsRepository.findActiveByRefreshTokenHash.mockResolvedValue(undefined);

    await expect(fixture.service.refresh('missing-refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(fixture.sessionsRepository.revoke).not.toHaveBeenCalled();
  });

  it('logs out active sessions', async () => {
    const fixture = createFixture();

    await expect(fixture.service.logout('refresh-token')).resolves.toEqual({ success: true });

    expect(fixture.sessionsRepository.findActiveByRefreshTokenHash).toHaveBeenCalledWith(
      'refresh-hash',
    );
    expect(fixture.sessionsRepository.revoke).toHaveBeenCalledWith('session_1');
  });

  it('returns logout success when no session exists', async () => {
    const fixture = createFixture();
    fixture.sessionsRepository.findActiveByRefreshTokenHash.mockResolvedValue(undefined);

    await expect(fixture.service.logout('refresh-token')).resolves.toEqual({ success: true });

    expect(fixture.sessionsRepository.revoke).not.toHaveBeenCalled();
  });

  it('returns public profiles for authenticated users', async () => {
    const fixture = createFixture();

    await expect(fixture.service.getProfile('user_1')).resolves.toEqual(publicUser);
  });

  it('rejects profile requests when the user no longer exists', async () => {
    const fixture = createFixture();
    fixture.usersRepository.findById.mockResolvedValue(undefined);

    await expect(fixture.service.getProfile('missing-user')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('delegates access-token verification', () => {
    const fixture = createFixture();

    expect(fixture.service.verifyAccessToken('access-token')).toEqual({
      id: 'user_1',
      email: 'ada@example.com',
      roles: ['user'],
    });
    expect(fixture.tokenService.verifyAccessToken).toHaveBeenCalledWith('access-token');
  });

  it('fails auth response creation if the token service omits refresh tokens', async () => {
    const fixture = createFixture();
    fixture.tokenService.issueTokens.mockReturnValue({
      accessToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    });

    await expect(
      fixture.service.loginManual({
        email: 'ada@example.com',
        password: 'Correct1!',
      }),
    ).rejects.toThrow('TokenService did not issue a refresh token.');
  });
});

interface AuthServiceFixture {
  googleOAuthService: jest.Mocked<Pick<GoogleOAuthService, 'complete' | 'start'>>;
  passwordService: jest.Mocked<Pick<PasswordService, 'hash' | 'verify'>>;
  service: AuthService;
  sessionsRepository: jest.Mocked<
    Pick<SessionsRepository, 'create' | 'findActiveByRefreshTokenHash' | 'revoke'>
  >;
  tokenService: jest.Mocked<
    Pick<TokenService, 'hashRefreshToken' | 'issueTokens' | 'verifyAccessToken'>
  >;
  usersRepository: jest.Mocked<
    Pick<
      UsersRepository,
      'createManual' | 'findByEmail' | 'findById' | 'toPublicUser' | 'upsertGoogle'
    >
  >;
}

function createFixture(): AuthServiceFixture {
  const usersRepository = {
    createManual: jest.fn().mockResolvedValue(storedUser),
    findByEmail: jest.fn().mockResolvedValue(storedUser),
    findById: jest.fn().mockResolvedValue(storedUser),
    toPublicUser: jest.fn().mockReturnValue(publicUser),
    upsertGoogle: jest.fn().mockResolvedValue(storedUser),
  };
  const sessionsRepository = {
    create: jest.fn().mockResolvedValue(createSession()),
    findActiveByRefreshTokenHash: jest.fn().mockResolvedValue(createSession()),
    revoke: jest.fn().mockResolvedValue(undefined),
  };
  const passwordService = {
    hash: jest.fn().mockResolvedValue({ hash: 'hashed-password', salt: 'salt' }),
    verify: jest.fn().mockResolvedValue(true),
  };
  const tokenService = {
    hashRefreshToken: jest.fn().mockReturnValue('refresh-hash'),
    issueTokens: jest.fn().mockReturnValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    }),
    verifyAccessToken: jest.fn().mockReturnValue({
      id: 'user_1',
      email: 'ada@example.com',
      roles: ['user'],
    }),
  };
  const googleOAuthService = {
    complete: jest.fn().mockResolvedValue({
      subject: 'google-subject',
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      emailVerified: true,
    }),
    start: jest.fn().mockResolvedValue({
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      state: 'state',
      expiresAt: new Date('2026-04-15T00:10:00.000Z'),
    }),
  };

  return {
    googleOAuthService,
    passwordService,
    service: new AuthService(
      { refreshTokenTtlSeconds: 2_592_000 } as AuthConfigService,
      usersRepository as unknown as UsersRepository,
      sessionsRepository as unknown as SessionsRepository,
      passwordService as unknown as PasswordService,
      tokenService as unknown as TokenService,
      googleOAuthService as unknown as GoogleOAuthService,
    ),
    sessionsRepository,
    tokenService,
    usersRepository,
  };
}

function createSession(): AuthSession {
  return {
    id: 'session_1',
    userId: 'user_1',
    refreshTokenHash: 'refresh-hash',
    expiresAt: new Date('2026-05-15T00:00:00.000Z'),
    createdAt: new Date('2026-04-15T00:00:00.000Z'),
  };
}

function expectedAuthResponse(): AuthResponse {
  return {
    user: publicUser,
    tokens: {
      accessToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    },
  };
}
