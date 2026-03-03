import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { ChecklistTemplateItem } from '@/modules/checklist-template-items/entities/checklist-template-item.entity';
import { ChecklistType } from '@/common/enums/checklist-type.enum';

@Entity('checklist_templates')
export class ChecklistTemplate extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: ChecklistType })
  type: ChecklistType;

  @OneToMany(() => ChecklistTemplateItem, (item) => item.checklistTemplate)
  items: ChecklistTemplateItem[];
}
