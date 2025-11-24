import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTripDayDto {
  @IsString()
  @IsOptional()
  tripId?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  dayIndex?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
