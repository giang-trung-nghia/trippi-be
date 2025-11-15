import {
  BaseEntity as TypeOrmBaseEntity,
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  @BeforeInsert()
  protected ensureId(): void {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

