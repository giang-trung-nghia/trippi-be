import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { ChecklistTemplatesService } from '@/modules/checklist-templates/checklist-templates.service';
import { ChecklistTemplatesController } from '@/modules/checklist-templates/checklist-templates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistTemplate])],
  controllers: [ChecklistTemplatesController],
  providers: [ChecklistTemplatesService],
  exports: [ChecklistTemplatesService],
})
export class ChecklistTemplatesModule {}
