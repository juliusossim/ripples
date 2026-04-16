import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { PropertyListingStatus } from '@org/types';

const listingStatuses: readonly PropertyListingStatus[] = [
  'draft',
  'active',
  'under-offer',
  'sold',
  'archived',
];

export class PropertyLocationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  city!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  country!: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class PropertyPriceDto {
  @IsNumber()
  amount!: number;

  @IsString()
  @Matches(/^[a-zA-Z]{3}$/)
  currency!: string;
}

export class PropertyMediaDto {
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  url!: string;

  @IsIn(['image', 'video'])
  type!: 'image' | 'video';

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  alt!: string;
}

export class CreatePropertyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PropertyLocationDto)
  location!: PropertyLocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PropertyPriceDto)
  price!: PropertyPriceDto;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => PropertyMediaDto)
  media!: PropertyMediaDto[];

  @IsOptional()
  @IsIn(listingStatuses)
  status?: PropertyListingStatus;
}
