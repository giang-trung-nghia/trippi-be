import { UserRole } from '@/common/enums/user-role.enum';

export class AuthUserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  photoUrl?: string;
}
