import { PartialType } from '@nestjs/mapped-types';
import { CreateGeoPhotoDto } from './create-geo-photo.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGeoPhotoDto extends PartialType(CreateGeoPhotoDto) {
  @IsString()
  @IsOptional()
  geoId?: string;
}
