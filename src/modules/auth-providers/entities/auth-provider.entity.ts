import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';
import { AuthProviderEnum } from '@/common/enums/auth-provider.enum';

@Entity('auth_provider')
export class AuthProvider extends BaseEntity {
  @Column({ type: 'enum', enum: AuthProviderEnum })
  provider: AuthProviderEnum;

  @Column({ unique: true, nullable: true })
  providerUserId?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @ManyToOne(() => User, (user) => user.authProviders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
