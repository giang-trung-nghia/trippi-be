import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGeoTypeDto {
  @IsString()
  @IsNotEmpty()
  googleType: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
