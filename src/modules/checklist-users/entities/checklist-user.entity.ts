import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { ChecklistUserItem } from '@/modules/checklist-user-items/entities/checklist-user-item.entity';

@Entity('checklist_users')
export class ChecklistUser extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.checklistUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ChecklistTemplate, { nullable: true })
  @JoinColumn({ name: 'template_id' })
  template?: ChecklistTemplate;

  @OneToMany(() => ChecklistUserItem, (item) => item.checklistUser)
  items: ChecklistUserItem[];
}
