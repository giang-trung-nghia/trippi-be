import { UserRole } from '@/common/enums/user-role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
