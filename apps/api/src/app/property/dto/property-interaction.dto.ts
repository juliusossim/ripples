import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PropertyInteractionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  sessionId!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  userId?: string;
}
