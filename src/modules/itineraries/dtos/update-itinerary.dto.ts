import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateItineraryDto {
  @IsDateString()
  @IsOptional()
  day?: string;

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
  @IsOptional()
  tripId?: string;
}

