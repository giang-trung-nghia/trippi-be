import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
}

