import { TripStatus } from '@/common/enums/trip-status.enum';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { TripDayDetailDto } from '../../trip-days/dtos/trip-day-detail.dto';

export class TripDetailDto {
  id: string;
  name: string;
  description?: string;
  destination?: string | null;
  coverImage?: string | null;
  startDate: string;
  endDate: string;
  status: TripStatus;
  budget: number;
  members: TripMember[];
  days: TripDayDetailDto[];
  totalEstimatedCost: number;
  totalActualCost: number;
  totalDays: number;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
