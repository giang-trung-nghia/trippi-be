import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistTemplateItem } from '@/modules/checklist-template-items/entities/checklist-template-item.entity';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { ChecklistTemplateItemsService } from '@/modules/checklist-template-items/checklist-template-items.service';
import { ChecklistTemplateItemsController } from '@/modules/checklist-template-items/checklist-template-items.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChecklistTemplateItem, ChecklistTemplate]),
  ],
  controllers: [ChecklistTemplateItemsController],
  providers: [ChecklistTemplateItemsService],
  exports: [ChecklistTemplateItemsService],
})
export class ChecklistTemplateItemsModule {}
