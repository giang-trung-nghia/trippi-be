import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDate,
} from 'class-validator';

export class CreateGeoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  lng: number;

  @IsString()
  @IsNotEmpty()
  geoTypeId: string;

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
