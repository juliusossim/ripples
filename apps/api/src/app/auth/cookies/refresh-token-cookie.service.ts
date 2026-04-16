import { Injectable } from '@nestjs/common';
import { parse, serialize } from 'cookie';
import type { CookieReader, HeaderWriter } from '../auth.types';
import { AuthConfigService } from '../services/auth-config.service';

@Injectable()
export class RefreshTokenCookieService {
  readonly cookieName = 'ripples.refresh_token';

  constructor(private readonly config: AuthConfigService) {}

  read(request: CookieReader): string | undefined {
    const header = request.headers.cookie;
    const cookieHeader = Array.isArray(header) ? header.join('; ') : header;
    if (!cookieHeader) {
      return undefined;
    }

    return parse(cookieHeader)[this.cookieName];
  }

  write(response: HeaderWriter, refreshToken: string, expiresAt: Date): void {
    response.setHeader(
      'Set-Cookie',
      serialize(this.cookieName, refreshToken, {
        httpOnly: true,
        secure: this.config.cookieSecure,
        sameSite: this.config.cookieSameSite,
        path: '/api/auth',
        expires: expiresAt,
        maxAge: Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)),
      }),
    );
  }

  clear(response: HeaderWriter): void {
    response.setHeader(
      'Set-Cookie',
      serialize(this.cookieName, '', {
        httpOnly: true,
        secure: this.config.cookieSecure,
        sameSite: this.config.cookieSameSite,
        path: '/api/auth',
        expires: new Date(0),
        maxAge: 0,
      }),
    );
  }
}
