import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { UserRole } from '@/common/enums/user-role.enum';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { AuthProvider } from '@/modules/auth-providers/entities/auth-provider.entity';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @OneToMany(() => AuthProvider, (authProvider) => authProvider.user)
  authProviders: AuthProvider[];

  @OneToMany(() => TripMember, (tripMember) => tripMember.user)
  tripMembers: TripMember[];
}
