import { AuthUserResponseDto } from '@/modules/auth/dtos/auth-user-response.dto';

export class AuthSessionResponseDto {
  accessToken: string;
  user: AuthUserResponseDto;
}
