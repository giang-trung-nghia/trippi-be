import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateGeoPhotoDto {
  @IsUrl()
  photoUrl: string;

  @IsString()
  @IsNotEmpty()
  geoId: string;
}
