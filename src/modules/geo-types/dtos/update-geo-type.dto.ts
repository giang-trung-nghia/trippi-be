import { IsOptional, IsString } from 'class-validator';

export class UpdateGeoTypeDto {
  @IsString()
  @IsOptional()
  googleType?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
