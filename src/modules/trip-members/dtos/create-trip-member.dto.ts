import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TripMemberRole } from '@/common/enums/trip-member-role.enum';

export class CreateTripMemberDto {
  @IsString()
  @IsNotEmpty()
  tripId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(TripMemberRole)
  role: TripMemberRole;
}
