import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChecklistTemplateItem } from '@/modules/checklist-template-items/entities/checklist-template-item.entity';
import { CreateChecklistTemplateItemDto } from '@/modules/checklist-template-items/dtos/create-checklist-template-item.dto';
import { UpdateChecklistTemplateItemDto } from '@/modules/checklist-template-items/dtos/update-checklist-template-item.dto';
import { ReorderChecklistTemplateItemDto } from '@/modules/checklist-template-items/dtos/reorder-checklist-template-item.dto';
import { ChecklistTemplateItemsService } from '@/modules/checklist-template-items/checklist-template-items.service';
import { BaseController } from '@/modules/base/base.controller';

@ApiTags('Checklist Template Items')
@Controller('api/v1/checklist-template-items')
export class ChecklistTemplateItemsController extends BaseController<
  ChecklistTemplateItem,
  CreateChecklistTemplateItemDto,
  UpdateChecklistTemplateItemDto
> {
  constructor(
    protected readonly checklistTemplateItemsService: ChecklistTemplateItemsService,
  ) {
    super(checklistTemplateItemsService);
  }

  @Post('reorder')
  reorder(
    @Body() reorderDto: ReorderChecklistTemplateItemDto,
  ): Promise<ChecklistTemplateItem[]> {
    return this.checklistTemplateItemsService.reorder(reorderDto);
  }
}
