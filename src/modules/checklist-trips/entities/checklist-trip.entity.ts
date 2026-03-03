import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';
import { ChecklistTripItem } from '@/modules/checklist-trip-items/entities/checklist-trip-item.entity';

@Entity('checklist_trips')
export class ChecklistTrip extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Trip, (trip) => trip.checklists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => ChecklistUser, { nullable: true })
  @JoinColumn({ name: 'checklist_user_id' })
  checklistUser?: ChecklistUser;

  @OneToMany(() => ChecklistTripItem, (item) => item.checklistTrip)
  items: ChecklistTripItem[];
}
