import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTripDayDto {
  @IsString()
  @IsNotEmpty()
  tripId: string;

  @Type(() => Number)
  @IsInt()
  dayIndex: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  note?: string;
}
