import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateGeoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lat?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lng?: number;

  @IsString()
  @IsOptional()
  geoTypeId?: string;

  @IsString()
  @IsOptional()
  googlePlaceId?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  minDurationMinutes?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  maxDurationMinutes?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedCost?: number;

  @IsDate()
  @IsOptional()
  standardOpeningHours?: Date;

  @IsDate()
  @IsOptional()
  standardClosingHours?: Date;
}
