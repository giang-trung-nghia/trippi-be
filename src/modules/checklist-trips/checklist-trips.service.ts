import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistTrip } from '@/modules/checklist-trips/entities/checklist-trip.entity';
import { CreateChecklistTripDto } from '@/modules/checklist-trips/dtos/create-checklist-trip.dto';
import { UpdateChecklistTripDto } from '@/modules/checklist-trips/dtos/update-checklist-trip.dto';
import { CopyFromUserChecklistDto } from '@/modules/checklist-trips/dtos/copy-from-user-checklist.dto';
import { BaseService } from '@/modules/base/base.service';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';
import { ChecklistTripItem } from '@/modules/checklist-trip-items/entities/checklist-trip-item.entity';

@Injectable()
export class ChecklistTripsService extends BaseService<
  ChecklistTrip,
  CreateChecklistTripDto,
  UpdateChecklistTripDto
> {
  constructor(
    @InjectRepository(ChecklistTrip)
    private readonly checklistTripRepository: Repository<ChecklistTrip>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(ChecklistUser)
    private readonly checklistUserRepository: Repository<ChecklistUser>,
    @InjectRepository(ChecklistTripItem)
    private readonly checklistTripItemRepository: Repository<ChecklistTripItem>,
  ) {
    super(checklistTripRepository, 'ChecklistTrip');
  }

  async create(createDto: CreateChecklistTripDto): Promise<ChecklistTrip> {
    const trip = await this.findTrip(createDto.tripId);
    const payload: Record<string, unknown> = {
      name: createDto.name,
      trip,
    };

    if (createDto.checklistUserId) {
      const userChecklist = await this.findUserChecklist(
        createDto.checklistUserId,
      );
      payload.checklistUser = userChecklist;
    }

    return super.create(payload as unknown as CreateChecklistTripDto);
  }

  async copyFromUserChecklist(
    copyDto: CopyFromUserChecklistDto,
  ): Promise<ChecklistTrip> {
    return this.checklistTripRepository.manager.transaction(async (manager) => {
      const userChecklist = await manager.findOne(ChecklistUser, {
        where: { id: copyDto.checklistUserId },
        relations: ['items'],
      });

      if (!userChecklist) {
        throw new NotFoundException('User checklist not found');
      }

      const trip = await manager.findOne(Trip, {
        where: { id: copyDto.tripId },
      });

      if (!trip) {
        throw new NotFoundException('Trip not found');
      }

      const tripChecklist = manager.create(ChecklistTrip, {
        name: userChecklist.name,
        trip,
        checklistUser: userChecklist,
      });
      await manager.save(tripChecklist);

      const items = userChecklist.items.map((item) =>
        manager.create(ChecklistTripItem, {
          name: item.name,
          orderIndex: item.orderIndex,
          checklistTrip: tripChecklist,
          isChecked: false,
        }),
      );
      await manager.save(items);

      return manager.findOne(ChecklistTrip, {
        where: { id: tripChecklist.id },
        relations: ['items'],
      }) as Promise<ChecklistTrip>;
    });
  }

  private async findTrip(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  private async findUserChecklist(id: string): Promise<ChecklistUser> {
    const checklist = await this.checklistUserRepository.findOne({
      where: { id },
    });
    if (!checklist) {
      throw new NotFoundException('User checklist not found');
    }
    return checklist;
  }
}
