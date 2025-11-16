import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthProviderEnum } from '@/common/enums/auth-provider.enum';

export class UpdateAuthProviderDto {
  @IsEnum(AuthProviderEnum)
  @IsOptional()
  provider?: AuthProviderEnum;

  @IsString()
  @IsOptional()
  providerUserId?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}

