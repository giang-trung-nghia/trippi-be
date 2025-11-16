import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthProviderEnum } from '@/common/enums/auth-provider.enum';

export class CreateAuthProviderDto {
  @IsEnum(AuthProviderEnum)
  provider: AuthProviderEnum;

  @IsString()
  @IsOptional()
  providerUserId?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

