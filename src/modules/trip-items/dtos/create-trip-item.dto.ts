import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TripItemType } from '@/common/enums/trip-item-type.enum';

export class CreateTripItemDto {
  @IsOptional()
  @IsString()
  customName?: string;

  @IsEnum(TripItemType)
  type: TripItemType;

  @IsObject()
  snapshot: Record<string, unknown>;

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
  durationMinutes?: number;

  @Type(() => Number)
  @IsInt()
  orderIndex: number;

  @IsString()
  @IsNotEmpty()
  tripDayId: string;

  @IsString()
  @IsNotEmpty()
  googlePlaceId: string;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}
