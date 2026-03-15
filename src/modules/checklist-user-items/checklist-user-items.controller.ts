import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChecklistUserItem } from '@/modules/checklist-user-items/entities/checklist-user-item.entity';
import { CreateChecklistUserItemDto } from '@/modules/checklist-user-items/dtos/create-checklist-user-item.dto';
import { UpdateChecklistUserItemDto } from '@/modules/checklist-user-items/dtos/update-checklist-user-item.dto';
import { ReorderChecklistUserItemDto } from '@/modules/checklist-user-items/dtos/reorder-checklist-user-item.dto';
import { ChecklistUserItemsService } from '@/modules/checklist-user-items/checklist-user-items.service';
import { BaseController } from '@/modules/base/base.controller';

@ApiTags('User Checklist Items')
@Controller('v1/checklist-user-items')
export class ChecklistUserItemsController extends BaseController<
  ChecklistUserItem,
  CreateChecklistUserItemDto,
  UpdateChecklistUserItemDto
> {
  constructor(
    protected readonly checklistUserItemsService: ChecklistUserItemsService,
  ) {
    super(checklistUserItemsService);
  }

  @Post('reorder')
  reorder(
    @Body() reorderDto: ReorderChecklistUserItemDto,
  ): Promise<ChecklistUserItem[]> {
    return this.checklistUserItemsService.reorder(reorderDto);
  }
}
