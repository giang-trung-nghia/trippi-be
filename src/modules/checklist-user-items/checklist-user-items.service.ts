import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistUserItem } from '@/modules/checklist-user-items/entities/checklist-user-item.entity';
import { CreateChecklistUserItemDto } from '@/modules/checklist-user-items/dtos/create-checklist-user-item.dto';
import { UpdateChecklistUserItemDto } from '@/modules/checklist-user-items/dtos/update-checklist-user-item.dto';
import { ReorderChecklistUserItemDto } from '@/modules/checklist-user-items/dtos/reorder-checklist-user-item.dto';
import { BaseService } from '@/modules/base/base.service';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';

@Injectable()
export class ChecklistUserItemsService extends BaseService<
  ChecklistUserItem,
  CreateChecklistUserItemDto,
  UpdateChecklistUserItemDto
> {
  constructor(
    @InjectRepository(ChecklistUserItem)
    private readonly checklistUserItemRepository: Repository<ChecklistUserItem>,
    @InjectRepository(ChecklistUser)
    private readonly checklistUserRepository: Repository<ChecklistUser>,
  ) {
    super(checklistUserItemRepository, 'ChecklistUserItem');
  }

  async create(
    createDto: CreateChecklistUserItemDto,
  ): Promise<ChecklistUserItem> {
    const checklist = await this.findChecklistUser(createDto.checklistUserId);
    const { ...rest } = createDto;
    return super.create({
      ...rest,
      checklistUser: checklist,
    } as unknown as CreateChecklistUserItemDto);
  }

  async update(
    id: string,
    updateDto: UpdateChecklistUserItemDto,
  ): Promise<ChecklistUserItem> {
    const payload: Record<string, unknown> = { ...updateDto };
    if (updateDto.checklistUserId) {
      payload.checklistUser = await this.findChecklistUser(
        updateDto.checklistUserId,
      );
    }
    return super.update(id, updateDto);
  }

  async reorder(
    reorderDto: ReorderChecklistUserItemDto,
  ): Promise<ChecklistUserItem[]> {
    const { checklistUserId, itemIds } = reorderDto;

    await this.findChecklistUser(checklistUserId);

    const items = await this.checklistUserItemRepository.find({
      where: { checklistUser: { id: checklistUserId } },
    });

    const itemIdSet = new Set(items.map((item) => item.id));

    for (const id of itemIds) {
      if (!itemIdSet.has(id)) {
        throw new BadRequestException(
          `Item with ID ${id} does not belong to checklist ${checklistUserId}`,
        );
      }
    }

    if (itemIds.length !== items.length) {
      throw new BadRequestException(
        `Item count mismatch. Expected ${items.length} items but received ${itemIds.length}`,
      );
    }

    const updatedItems: ChecklistUserItem[] = [];
    for (let i = 0; i < itemIds.length; i++) {
      const item = items.find((item) => item.id === itemIds[i]);
      if (item) {
        item.orderIndex = i;
        const updated = await this.checklistUserItemRepository.save(item);
        updatedItems.push(updated);
      }
    }

    return updatedItems;
  }

  private async findChecklistUser(id: string): Promise<ChecklistUser> {
    const checklist = await this.checklistUserRepository.findOne({
      where: { id },
    });
    if (!checklist) {
      throw new NotFoundException('User checklist not found');
    }
    return checklist;
  }
}
