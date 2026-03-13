import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { CreateChecklistTemplateDto } from '@/modules/checklist-templates/dtos/create-checklist-template.dto';
import { UpdateChecklistTemplateDto } from '@/modules/checklist-templates/dtos/update-checklist-template.dto';
import { BaseService } from '@/modules/base/base.service';
import { ChecklistType } from '@/common/enums/checklist-type.enum';

@Injectable()
export class ChecklistTemplatesService extends BaseService<
  ChecklistTemplate,
  CreateChecklistTemplateDto,
  UpdateChecklistTemplateDto
> {
  constructor(
    @InjectRepository(ChecklistTemplate)
    private readonly checklistTemplateRepository: Repository<ChecklistTemplate>,
  ) {
    super(checklistTemplateRepository, 'ChecklistTemplate');
  }

  async findAll(type?: ChecklistType): Promise<ChecklistTemplate[]> {
    return this.checklistTemplateRepository.find({
      where: type ? { type } : {},
      order: this.defaultOrder,
      relations: ['items'],
    });
  }
}
