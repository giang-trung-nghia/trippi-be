import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { TripStatus } from '@/common/enums/trip-status.enum';
import { User } from '@/modules/users/entities/user.entity';

@Entity('trips')
export class Trip extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'float', nullable: true })
  budget?: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  description: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  coverImageUrl?: string;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.PLANNING })
  status: TripStatus;

  @ManyToOne(() => User, (user) => user.trips)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => TripMember, (tripMember) => tripMember.trip)
  members: TripMember[];

  @OneToMany(() => TripDay, (tripDay) => tripDay.trip)
  days: TripDay[];
}
