import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateItineraryDto {
  @IsDateString()
  day: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  customName?: string;

  @IsString()
  @IsOptional()
  geoId?: string;

  @IsString()
  @IsNotEmpty()
  tripId: string;
}

