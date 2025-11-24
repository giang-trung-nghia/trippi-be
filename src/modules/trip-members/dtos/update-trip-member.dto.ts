import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TripMemberRole } from '@/common/enums/trip-member-role.enum';

export class UpdateTripMemberDto {
  @IsEnum(TripMemberRole)
  @IsOptional()
  role?: TripMemberRole;

  // remove userId from update
  @IsString()
  @IsOptional()
  userId?: string;

  // remove tripId from update
  @IsString()
  @IsOptional()
  tripId?: string;
}
