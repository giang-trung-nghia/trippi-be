import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGeoTypeDto {
  @IsString()
  @IsNotEmpty()
  googleType: string;

  @IsString()
  @IsNotEmpty()
  displayNameEn: string;

  @IsString()
  @IsNotEmpty()
  displayNameVn: string;
}

