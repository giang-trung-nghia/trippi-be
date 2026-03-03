import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';

@Entity('checklist_template_items')
@Unique(['checklistTemplate', 'orderIndex'])
export class ChecklistTemplateItem extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'integer' })
  orderIndex: number;

  @ManyToOne(() => ChecklistTemplate, (template) => template.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checklist_template_id' })
  checklistTemplate: ChecklistTemplate;
}
