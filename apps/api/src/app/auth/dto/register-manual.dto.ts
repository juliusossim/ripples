import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import type { RegisterManualRequest } from '@org/types';

export class RegisterManualDto implements RegisterManualRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(256)
  password!: string;
}
