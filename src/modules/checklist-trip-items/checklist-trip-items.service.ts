import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistTripItem } from '@/modules/checklist-trip-items/entities/checklist-trip-item.entity';
import { CreateChecklistTripItemDto } from '@/modules/checklist-trip-items/dtos/create-checklist-trip-item.dto';
import { UpdateChecklistTripItemDto } from '@/modules/checklist-trip-items/dtos/update-checklist-trip-item.dto';
import { ReorderChecklistTripItemDto } from '@/modules/checklist-trip-items/dtos/reorder-checklist-trip-item.dto';
import { ToggleCheckDto } from '@/modules/checklist-trip-items/dtos/toggle-check.dto';
import { BulkCheckDto } from '@/modules/checklist-trip-items/dtos/bulk-check.dto';
import { BaseService } from '@/modules/base/base.service';
import { ChecklistTrip } from '@/modules/checklist-trips/entities/checklist-trip.entity';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class ChecklistTripItemsService extends BaseService<
  ChecklistTripItem,
  CreateChecklistTripItemDto,
  UpdateChecklistTripItemDto
> {
  constructor(
    @InjectRepository(ChecklistTripItem)
    private readonly checklistTripItemRepository: Repository<ChecklistTripItem>,
    @InjectRepository(ChecklistTrip)
    private readonly checklistTripRepository: Repository<ChecklistTrip>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(checklistTripItemRepository, 'ChecklistTripItem');
  }

  async create(
    createDto: CreateChecklistTripItemDto,
  ): Promise<ChecklistTripItem> {
    const checklist = await this.findChecklistTrip(createDto.checklistTripId);
    const { ...rest } = createDto;
    return super.create({
      ...rest,
      checklistTrip: checklist,
      isChecked: false,
    } as unknown as CreateChecklistTripItemDto);
  }

  async update(
    id: string,
    updateDto: UpdateChecklistTripItemDto,
  ): Promise<ChecklistTripItem> {
    const payload: Record<string, unknown> = { ...updateDto };
    if (updateDto.checklistTripId) {
      payload.checklistTrip = await this.findChecklistTrip(
        updateDto.checklistTripId,
      );
    }
    return super.update(id, updateDto);
  }

  async toggleCheck(
    itemId: string,
    toggleDto: ToggleCheckDto,
  ): Promise<ChecklistTripItem> {
    const item = await this.findByIdOrFail(itemId);
    const user = await this.findUser(toggleDto.userId);

    item.isChecked = !item.isChecked;
    item.checkedAt = item.isChecked ? new Date() : undefined;
    item.checkedBy = item.isChecked ? user : undefined;

    return this.checklistTripItemRepository.save(item);
  }

  async bulkCheck(bulkCheckDto: BulkCheckDto): Promise<ChecklistTripItem[]> {
    const user = await this.findUser(bulkCheckDto.userId);
    const items = await this.checklistTripItemRepository.findByIds(
      bulkCheckDto.itemIds,
    );

    if (items.length !== bulkCheckDto.itemIds.length) {
      throw new BadRequestException('Some items were not found');
    }

    const now = new Date();
    const updatedItems = items.map((item) => {
      item.isChecked = true;
      item.checkedAt = now;
      item.checkedBy = user;
      return item;
    });

    return this.checklistTripItemRepository.save(updatedItems);
  }

  async reorder(
    reorderDto: ReorderChecklistTripItemDto,
  ): Promise<ChecklistTripItem[]> {
    const { checklistTripId, itemIds } = reorderDto;

    await this.findChecklistTrip(checklistTripId);

    const items = await this.checklistTripItemRepository.find({
      where: { checklistTrip: { id: checklistTripId } },
    });

    const itemIdSet = new Set(items.map((item) => item.id));

    for (const id of itemIds) {
      if (!itemIdSet.has(id)) {
        throw new BadRequestException(
          `Item with ID ${id} does not belong to checklist ${checklistTripId}`,
        );
      }
    }

    if (itemIds.length !== items.length) {
      throw new BadRequestException(
        `Item count mismatch. Expected ${items.length} items but received ${itemIds.length}`,
      );
    }

    const updatedItems: ChecklistTripItem[] = [];
    for (let i = 0; i < itemIds.length; i++) {
      const item = items.find((item) => item.id === itemIds[i]);
      if (item) {
        item.orderIndex = i;
        const updated = await this.checklistTripItemRepository.save(item);
        updatedItems.push(updated);
      }
    }

    return updatedItems;
  }

  private async findChecklistTrip(id: string): Promise<ChecklistTrip> {
    const checklist = await this.checklistTripRepository.findOne({
      where: { id },
    });
    if (!checklist) {
      throw new NotFoundException('Trip checklist not found');
    }
    return checklist;
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
