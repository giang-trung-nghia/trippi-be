import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { TripItemType } from '@/common/enums/trip-item-type.enum';

@Entity('trip_items')
@Unique(['tripDay', 'orderIndex'])
export class TripItem extends BaseEntity {
  @Column({ nullable: true })
  customName?: string;

  @Column({ type: 'enum', enum: TripItemType })
  type: TripItemType;

  @Column({ type: 'json' })
  snapshot: Record<string, unknown>; // The snapshot of the item (name, address, lat, lng, rating, photos, etc.)

  @Column({ type: 'time', nullable: true })
  startTime?: string;

  @Column({ type: 'time', nullable: true })
  endTime?: string;

  @Column({ type: 'float', nullable: true })
  cost?: number;

  @Column({ type: 'float', nullable: true })
  estimatedCost?: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'integer', nullable: true })
  durationMinutes?: number;

  @Column({ type: 'integer' })
  orderIndex: number; // The order index of the item in the day

  @ManyToOne(() => TripDay, (tripDay) => tripDay.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_day_id' })
  tripDay: TripDay;

  @ManyToOne(() => Geo, (geo) => geo.items, { nullable: true })
  @JoinColumn({ name: 'geo_id' })
  geo?: Geo;
}
