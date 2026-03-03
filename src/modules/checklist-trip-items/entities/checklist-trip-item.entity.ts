import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { ChecklistTrip } from '@/modules/checklist-trips/entities/checklist-trip.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('checklist_trip_items')
@Unique(['checklistTrip', 'orderIndex'])
export class ChecklistTripItem extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'integer' })
  orderIndex: number;

  @Column({ type: 'boolean', default: false })
  isChecked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  checkedAt?: Date;

  @ManyToOne(() => ChecklistTrip, (checklist) => checklist.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checklist_trip_id' })
  checklistTrip: ChecklistTrip;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'checked_by_id' })
  checkedBy?: User;
}
