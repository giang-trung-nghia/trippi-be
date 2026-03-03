import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { CreateChecklistTemplateDto } from '@/modules/checklist-templates/dtos/create-checklist-template.dto';
import { UpdateChecklistTemplateDto } from '@/modules/checklist-templates/dtos/update-checklist-template.dto';
import { ChecklistTemplatesService } from '@/modules/checklist-templates/checklist-templates.service';
import { BaseController } from '@/modules/base/base.controller';
import { ChecklistType } from '@/common/enums/checklist-type.enum';

@ApiTags('Checklist Templates')
@Controller('api/v1/checklist-templates')
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

  @Get('by-type/:type')
  findByType(@Param('type') type: ChecklistType): Promise<ChecklistTemplate[]> {
    return this.checklistTemplatesService.findByType(type);
  }
}
