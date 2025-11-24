import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TripItemType } from '@/common/enums/trip-item-type.enum';

export class UpdateTripItemDto {
  @IsEnum(TripItemType)
  @IsOptional()
  type?: TripItemType;

  @IsObject()
  @IsOptional()
  snapshot?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  estimatedDurationMinutes?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsString()
  @IsOptional()
  tripDayId?: string;

  @IsString()
  @IsOptional()
  geoId?: string;
}
