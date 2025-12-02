import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TripStatus } from '@/common/enums/trip-status.enum';

export class UpdateTripDto {
  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}
