import { IsOptional, IsString, MinLength } from 'class-validator';
import type { LogoutRequest, RefreshTokenRequest } from '@org/types';

export class RefreshTokenDto implements RefreshTokenRequest {
  @IsOptional()
  @IsString()
  @MinLength(20)
  refreshToken?: string;
}

export class LogoutDto implements LogoutRequest {
  @IsOptional()
  @IsString()
  @MinLength(20)
  refreshToken?: string;
}
