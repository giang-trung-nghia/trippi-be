export class TripItemDetailDto {
  id: string;
  type: string;
  customName?: string | null;
  cost?: number | null;
  estimatedCost?: number | null;
  name: string;
  durationMinutes?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  address?: string | null;
  googlePlaceId?: string | null;
  lat?: number | null;
  lng?: number | null;
  maxDurationMinutes?: number | null;
  minDurationMinutes?: number | null;
  phone?: string | null;
  standardClosingHours?: string | null;
  standardOpeningHours?: string | null;
  orderIndex: number;
  note?: string | null;
}
