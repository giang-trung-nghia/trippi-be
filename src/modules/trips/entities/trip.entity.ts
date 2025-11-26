import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';

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

  @ManyToOne(() => User, (user) => user.trips)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => TripMember, (tripMember) => tripMember.trip)
  members: TripMember[];

  @OneToMany(() => TripDay, (tripDay) => tripDay.trip)
  days: TripDay[];
}
