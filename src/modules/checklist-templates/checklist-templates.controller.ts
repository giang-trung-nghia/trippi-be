import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { CreateChecklistTemplateDto } from '@/modules/checklist-templates/dtos/create-checklist-template.dto';
import { UpdateChecklistTemplateDto } from '@/modules/checklist-templates/dtos/update-checklist-template.dto';
import { FilterChecklistTemplatesDto } from '@/modules/checklist-templates/dtos/filter-checklist-templates.dto';
import { ChecklistTemplatesService } from '@/modules/checklist-templates/checklist-templates.service';
import { BaseController } from '@/modules/base/base.controller';

@ApiTags('Checklist Templates')
@Controller('v1/checklist-templates')
export class ChecklistTemplatesController extends BaseController<
  ChecklistTemplate,
  CreateChecklistTemplateDto,
  UpdateChecklistTemplateDto
> {
  constructor(
    protected readonly checklistTemplatesService: ChecklistTemplatesService,
  ) {
    super(checklistTemplatesService);
  }

  @Get()
  findAll(
    @Query() filter?: FilterChecklistTemplatesDto,
  ): Promise<ChecklistTemplate[]> {
    return this.checklistTemplatesService.findAll(filter?.type);
  }
}
