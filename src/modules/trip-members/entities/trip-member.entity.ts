import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { User } from '@/modules/users/entities/user.entity';
import { TripMemberRole } from '@/common/enums/trip-member-role.enum';

@Entity('trip_members')
@Unique(['trip', 'user'])
export class TripMember extends BaseEntity {
  @Column({ type: 'enum', enum: TripMemberRole })
  role: TripMemberRole;

  @ManyToOne(() => Trip, (trip) => trip.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => User, (user) => user.tripMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
