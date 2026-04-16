import { IsIn, IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { EventType } from '@org/types';

const eventTypes: readonly EventType[] = [
  'view_property',
  'like_property',
  'save_property',
  'share_property',
  'click_ripple',
  'contact_seller',
  'start_transaction',
  'complete_transaction',
];

export class CreateEventDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  userId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  sessionId!: string;

  @IsIn(eventTypes)
  type!: EventType;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  entityId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  entityType!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
