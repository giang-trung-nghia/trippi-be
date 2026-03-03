import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistTemplateItem } from '@/modules/checklist-template-items/entities/checklist-template-item.entity';
import { CreateChecklistTemplateItemDto } from '@/modules/checklist-template-items/dtos/create-checklist-template-item.dto';
import { UpdateChecklistTemplateItemDto } from '@/modules/checklist-template-items/dtos/update-checklist-template-item.dto';
import { ReorderChecklistTemplateItemDto } from '@/modules/checklist-template-items/dtos/reorder-checklist-template-item.dto';
import { BaseService } from '@/modules/base/base.service';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';

@Injectable()
export class ChecklistTemplateItemsService extends BaseService<
  ChecklistTemplateItem,
  CreateChecklistTemplateItemDto,
  UpdateChecklistTemplateItemDto
> {
  constructor(
    @InjectRepository(ChecklistTemplateItem)
    private readonly checklistTemplateItemRepository: Repository<ChecklistTemplateItem>,
    @InjectRepository(ChecklistTemplate)
    private readonly checklistTemplateRepository: Repository<ChecklistTemplate>,
  ) {
    super(checklistTemplateItemRepository, 'ChecklistTemplateItem');
  }

  async create(
    createDto: CreateChecklistTemplateItemDto,
  ): Promise<ChecklistTemplateItem> {
    const template = await this.findChecklistTemplate(
      createDto.checklistTemplateId,
    );
    const { ...rest } = createDto;
    return super.create({
      ...rest,
      checklistTemplate: template,
    } as unknown as CreateChecklistTemplateItemDto);
  }

  async update(
    id: string,
    updateDto: UpdateChecklistTemplateItemDto,
  ): Promise<ChecklistTemplateItem> {
    const payload: Record<string, unknown> = { ...updateDto };
    if (updateDto.checklistTemplateId) {
      payload.checklistTemplate = await this.findChecklistTemplate(
        updateDto.checklistTemplateId,
      );
    }
    return super.update(id, updateDto);
  }

  async reorder(
    reorderDto: ReorderChecklistTemplateItemDto,
  ): Promise<ChecklistTemplateItem[]> {
    const { checklistTemplateId, itemIds } = reorderDto;

    await this.findChecklistTemplate(checklistTemplateId);

    const items = await this.checklistTemplateItemRepository.find({
      where: { checklistTemplate: { id: checklistTemplateId } },
    });

    const itemIdSet = new Set(items.map((item) => item.id));

    for (const id of itemIds) {
      if (!itemIdSet.has(id)) {
        throw new BadRequestException(
          `Item with ID ${id} does not belong to checklist template ${checklistTemplateId}`,
        );
      }
    }

    if (itemIds.length !== items.length) {
      throw new BadRequestException(
        `Item count mismatch. Expected ${items.length} items but received ${itemIds.length}`,
      );
    }

    const updatedItems: ChecklistTemplateItem[] = [];
    for (let i = 0; i < itemIds.length; i++) {
      const item = items.find((item) => item.id === itemIds[i]);
      if (item) {
        item.orderIndex = i;
        const updated = await this.checklistTemplateItemRepository.save(item);
        updatedItems.push(updated);
      }
    }

    return updatedItems;
  }

  private async findChecklistTemplate(id: string): Promise<ChecklistTemplate> {
    const template = await this.checklistTemplateRepository.findOne({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Checklist template not found');
    }
    return template;
  }
}
