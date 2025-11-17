import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '@/common/enums/user-role.enum';

export class CreateUserOauthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
