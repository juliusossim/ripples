import { IsString, IsUrl, MinLength } from 'class-validator';
import type { GoogleOAuthCallbackRequest, GoogleOAuthStartRequest } from '@org/types';

export class GoogleOAuthStartDto implements GoogleOAuthStartRequest {
  @IsUrl({ require_tld: false })
  redirectUri!: string;
}

export class GoogleOAuthCallbackDto implements GoogleOAuthCallbackRequest {
  @IsString()
  @MinLength(8)
  code!: string;

  @IsString()
  @MinLength(16)
  state!: string;

  @IsUrl({ require_tld: false })
  redirectUri!: string;
}
