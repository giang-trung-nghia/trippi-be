import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';

@Entity('trip_days')
@Unique(['trip', 'dayIndex'])
export class TripDay extends BaseEntity {
  @Column()
  dayIndex: number; // The index of the day in the trip (1, 2, 3...)

  @Column()
  date: Date; // The date of the day

  @Column({ nullable: true })
  note?: string;

  @ManyToOne(() => Trip, (trip) => trip.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @OneToMany(() => TripItem, (tripItem) => tripItem.tripDay)
  items: TripItem[];
}
