import { TripItemDetailDto } from '../../trip-items/dtos/trip-item-detail.dto';

export class TripDayDetailDto {
  id: string;
  dayIndex: number;
  date: string;
  note?: string | null;
  items: TripItemDetailDto[];
}
