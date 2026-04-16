import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { AuthResponse, AuthUser, GoogleOAuthStartResponse } from '@org/types';
import { AuthService } from './auth.service';
import { RefreshTokenCookieService } from './cookies/refresh-token-cookie.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { GoogleOAuthCallbackDto, GoogleOAuthStartDto } from './dto/google-oauth.dto';
import type { LoginManualDto } from './dto/login-manual.dto';
import type { LogoutDto, RefreshTokenDto } from './dto/refresh-token.dto';
import type { RegisterManualDto } from './dto/register-manual.dto';
import { AuthGuard } from './guards/auth.guard';
import type {
  AuthenticatedUser,
  AuthSessionResult,
  CookieReader,
  HeaderWriter,
} from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenCookieService: RefreshTokenCookieService,
  ) {}

  @Post('register')
  async registerManual(
    @Body() input: RegisterManualDto,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    return this.writeRefreshCookie(response, await this.authService.registerManual(input));
  }

  @Post('login')
  async loginManual(
    @Body() input: LoginManualDto,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    return this.writeRefreshCookie(response, await this.authService.loginManual(input));
  }

  @Post('refresh')
  async refresh(
    @Body() input: RefreshTokenDto,
    @Req() request: CookieReader,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    const refreshToken = this.readRefreshToken(input.refreshToken, request);

    return this.writeRefreshCookie(response, await this.authService.refresh(refreshToken));
  }

  @Post('logout')
  async logout(
    @Body() input: LogoutDto,
    @Req() request: CookieReader,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<{ success: true }> {
    const refreshToken = input.refreshToken ?? this.refreshTokenCookieService.read(request);
    this.refreshTokenCookieService.clear(response);
    if (!refreshToken) {
      return { success: true };
    }

    return this.authService.logout(refreshToken);
  }

  @Post('oauth/google/start')
  startGoogleOAuth(@Body() input: GoogleOAuthStartDto): Promise<GoogleOAuthStartResponse> {
    return this.authService.startGoogleOAuth(input.redirectUri);
  }

  @Post('oauth/google/callback')
  async completeGoogleOAuth(
    @Body() input: GoogleOAuthCallbackDto,
    @Res({ passthrough: true }) response: HeaderWriter,
  ): Promise<AuthResponse> {
    return this.writeRefreshCookie(
      response,
      await this.authService.completeGoogleOAuth(input.code, input.state, input.redirectUri),
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): Promise<AuthUser> {
    return this.authService.getProfile(user.id);
  }

  private writeRefreshCookie(response: HeaderWriter, result: AuthSessionResult): AuthResponse {
    this.refreshTokenCookieService.write(
      response,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );

    return result.response;
  }

  private readRefreshToken(inputToken: string | undefined, request: CookieReader): string {
    const refreshToken = inputToken ?? this.refreshTokenCookieService.read(request);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    return refreshToken;
  }
}
