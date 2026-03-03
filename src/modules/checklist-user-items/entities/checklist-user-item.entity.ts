import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';

@Entity('checklist_user_items')
@Unique(['checklistUser', 'orderIndex'])
export class ChecklistUserItem extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'integer' })
  orderIndex: number;

  @ManyToOne(() => ChecklistUser, (checklist) => checklist.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checklist_user_id' })
  checklistUser: ChecklistUser;
}
