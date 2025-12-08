import { TripStatus } from '@/common/enums/trip-status.enum';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';

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
  days: TripDay[];
  totalEstimatedCost: number;
  totalActualCost: number;
  totalDays: number;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
