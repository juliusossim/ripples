import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import type { LoginManualRequest } from '@org/types';

export class LoginManualDto implements LoginManualRequest {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  password!: string;
}
