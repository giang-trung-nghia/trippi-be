import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChecklistTripItem } from '@/modules/checklist-trip-items/entities/checklist-trip-item.entity';
import { CreateChecklistTripItemDto } from '@/modules/checklist-trip-items/dtos/create-checklist-trip-item.dto';
import { UpdateChecklistTripItemDto } from '@/modules/checklist-trip-items/dtos/update-checklist-trip-item.dto';
import { ReorderChecklistTripItemDto } from '@/modules/checklist-trip-items/dtos/reorder-checklist-trip-item.dto';
import { ToggleCheckDto } from '@/modules/checklist-trip-items/dtos/toggle-check.dto';
import { BulkCheckDto } from '@/modules/checklist-trip-items/dtos/bulk-check.dto';
import { ChecklistTripItemsService } from '@/modules/checklist-trip-items/checklist-trip-items.service';
import { BaseController } from '@/modules/base/base.controller';

@ApiTags('Trip Checklist Items')
@Controller('api/checklist-trip-items')
export class ChecklistTripItemsController extends BaseController<
  ChecklistTripItem,
  CreateChecklistTripItemDto,
  UpdateChecklistTripItemDto
> {
  constructor(
    protected readonly checklistTripItemsService: ChecklistTripItemsService,
  ) {
    super(checklistTripItemsService);
  }

  @Post(':id/toggle')
  toggleCheck(
    @Param('id') id: string,
    @Body() toggleDto: ToggleCheckDto,
  ): Promise<ChecklistTripItem> {
    return this.checklistTripItemsService.toggleCheck(id, toggleDto);
  }

  @Post('bulk-check')
  bulkCheck(@Body() bulkCheckDto: BulkCheckDto): Promise<ChecklistTripItem[]> {
    return this.checklistTripItemsService.bulkCheck(bulkCheckDto);
  }

  @Post('reorder')
  reorder(
    @Body() reorderDto: ReorderChecklistTripItemDto,
  ): Promise<ChecklistTripItem[]> {
    return this.checklistTripItemsService.reorder(reorderDto);
  }
}
