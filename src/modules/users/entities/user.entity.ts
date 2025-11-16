import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { UserRole } from '@/common/enums/user-role.enum';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { BaseEntity } from '@/modules/base/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];
}
