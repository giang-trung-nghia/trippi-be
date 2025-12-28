import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { CreateTripDto } from '@/modules/trips/dtos/create-trip.dto';
import { UpdateTripDto } from '@/modules/trips/dtos/update-trip.dto';
import { TripDetailDto } from '@/modules/trips/dtos/trip-detail.dto';
import { TripDayDetailDto } from '@/modules/trip-days/dtos/trip-day-detail.dto';
import { TripItemDetailDto } from '@/modules/trip-items/dtos/trip-item-detail.dto';
import { User } from '@/modules/users/entities/user.entity';
import { BaseService } from '@/modules/base/base.service';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { TripMemberRole } from '@/common/enums/trip-member-role.enum';

@Injectable()
export class TripsService extends BaseService<
  Trip,
  CreateTripDto,
  UpdateTripDto
> {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private readonly tripMemberRepository: Repository<TripMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TripDay)
    private readonly tripDayRepository: Repository<TripDay>,
    @InjectRepository(TripItem)
    private readonly tripItemRepository: Repository<TripItem>,
  ) {
    super(tripRepository, 'Trip');
  }

  async create(createDto: CreateTripDto): Promise<Trip> {
    const owner = await this.findUser(createDto.userId);
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);
    this.ensureValidDateRange(startDate, endDate);

    return this.tripRepository.manager.transaction(async (manager) => {
      const { ...rest } = createDto;
      const tripRepo = manager.getRepository(Trip);
      const tripDayRepo = manager.getRepository(TripDay);
      const tripMemberRepo = manager.getRepository(TripMember);

      const tripEntity = tripRepo.create({
        ...rest,
        user: owner,
        startDate,
        endDate,
      } as unknown as Trip);

      const trip = await tripRepo.save(tripEntity);

      const tripDays = this.buildTripDays(trip, startDate, endDate).map((day) =>
        tripDayRepo.create(day),
      );
      if (tripDays.length) {
        await tripDayRepo.save(tripDays);
      }

      const ownerMember = tripMemberRepo.create({
        trip,
        user: owner,
        role: TripMemberRole.OWNER,
      });
      await tripMemberRepo.save(ownerMember);

      return trip;
    });
  }

  async update(id: string, updateDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findByIdOrFail(id);
    const { userId, startDate, endDate, moveItemsFromDeletedDays, ...rest } =
      updateDto;
    const payload: Record<string, unknown> = { ...rest };
    let newOwner: User | undefined;

    const nextStart = startDate ? new Date(startDate) : trip.startDate;
    const nextEnd = endDate ? new Date(endDate) : trip.endDate;
    this.ensureValidDateRange(nextStart, nextEnd);

    const dateRangeChanged =
      startDate || endDate
        ? this.normalizeDate(trip.startDate).getTime() !==
            this.normalizeDate(nextStart).getTime() ||
          this.normalizeDate(trip.endDate).getTime() !==
            this.normalizeDate(nextEnd).getTime()
        : false;

    if (startDate) {
      payload.startDate = nextStart;
    }
    if (endDate) {
      payload.endDate = nextEnd;
    }

    if (userId) {
      newOwner = await this.findUser(userId);
      payload.user = newOwner;
    }

    return this.tripRepository.manager.transaction(async (manager) => {
      const tripRepo = manager.getRepository(Trip);
      const tripDayRepo = manager.getRepository(TripDay);
      const tripItemRepo = manager.getRepository(TripItem);

      this.tripRepository.merge(trip, payload as UpdateTripDto);
      const savedTrip = await tripRepo.save(trip);

      if (dateRangeChanged) {
        await this.handleDateRangeChange(
          savedTrip,
          nextStart,
          nextEnd,
          moveItemsFromDeletedDays ?? false,
          tripDayRepo,
          tripItemRepo,
        );
      }

      if (newOwner) {
        await this.setOwnerMember(savedTrip, newOwner);
      }

      return savedTrip;
    });
  }

  private async handleDateRangeChange(
    trip: Trip,
    newStartDate: Date,
    newEndDate: Date,
    moveItems: boolean,
    tripDayRepo: Repository<TripDay>,
    tripItemRepo: Repository<TripItem>,
  ): Promise<void> {
    const normalizedNewStart = this.normalizeDate(newStartDate);
    const normalizedNewEnd = this.normalizeDate(newEndDate);

    // Load all existing trip days with their items
    const existingDays = await tripDayRepo.find({
      where: { trip: { id: trip.id } },
      relations: ['items'],
      order: { dayIndex: 'ASC' },
    });

    // Find days that are outside the new date range
    const daysToDelete = existingDays.filter((day) => {
      const dayDate = this.normalizeDate(day.date);
      return (
        dayDate.getTime() < normalizedNewStart.getTime() ||
        dayDate.getTime() > normalizedNewEnd.getTime()
      );
    });

    // Find the last remaining day (or create new days if needed)
    const daysToKeep = existingDays.filter((day) => {
      const dayDate = this.normalizeDate(day.date);
      return (
        dayDate.getTime() >= normalizedNewStart.getTime() &&
        dayDate.getTime() <= normalizedNewEnd.getTime()
      );
    });

    // If moving items and we need to create new days (all existing days are being deleted),
    // create the new days first so we have a target day to move items to
    let targetDayForMoving: TripDay | null = null;
    if (moveItems && daysToDelete.length > 0 && daysToKeep.length === 0) {
      // Create all days for the new range first
      const expectedDays = this.buildTripDays(
        trip,
        normalizedNewStart,
        normalizedNewEnd,
      );
      const savedNewDays = await tripDayRepo.save(
        expectedDays.map((day) => tripDayRepo.create(day)),
      );
      targetDayForMoving = savedNewDays[savedNewDays.length - 1];
    }

    // Delete days outside the new range (but keep items if moving is requested)
    if (daysToDelete.length > 0) {
      // If moving items, extract them before deletion
      if (moveItems) {
        // Find the target day (last day in the new range)
        let targetDay: TripDay | null = targetDayForMoving;
        if (!targetDay && daysToKeep.length > 0) {
          // Use the last day in the new range
          targetDay = daysToKeep[daysToKeep.length - 1];
        }

        // If we have a target day, move items to it
        if (targetDay) {
          // Reload target day with items to get accurate orderIndex
          const targetDayWithItems = await tripDayRepo.findOne({
            where: { id: targetDay.id },
            relations: ['items'],
          });

          if (targetDayWithItems) {
            const itemsToMove: TripItem[] = [];
            for (const dayToDelete of daysToDelete) {
              if (dayToDelete.items && dayToDelete.items.length > 0) {
                itemsToMove.push(...dayToDelete.items);
              }
            }

            if (itemsToMove.length > 0) {
              // Get the current max orderIndex in the target day
              const existingItems = targetDayWithItems.items || [];
              const maxOrderIndex =
                existingItems.length > 0
                  ? Math.max(...existingItems.map((item) => item.orderIndex))
                  : -1;

              // Update items to move to the target day with new order indices
              for (let i = 0; i < itemsToMove.length; i++) {
                itemsToMove[i].tripDay = targetDayWithItems;
                itemsToMove[i].orderIndex = maxOrderIndex + 1 + i;
              }
              await tripItemRepo.save(itemsToMove);
            }
          }
        }
      }

      // Delete days outside the new range
      await tripDayRepo.remove(daysToDelete);
    }

    // Rebuild trip days for the new date range (create missing days)
    // Only create if we haven't already created them above
    if (!targetDayForMoving) {
      const existingDayDates = new Set(
        (await tripDayRepo.find({ where: { trip: { id: trip.id } } })).map(
          (day) => this.normalizeDate(day.date).getTime(),
        ),
      );

      const expectedDays = this.buildTripDays(
        trip,
        normalizedNewStart,
        normalizedNewEnd,
      );
      const daysToCreate = expectedDays.filter(
        (day) => !existingDayDates.has(this.normalizeDate(day.date).getTime()),
      );

      if (daysToCreate.length > 0) {
        await tripDayRepo.save(
          daysToCreate.map((day) => tripDayRepo.create(day)),
        );
      }
    }

    // Reindex all remaining days to ensure dayIndex matches the sequence
    const allRemainingDays = await tripDayRepo.find({
      where: { trip: { id: trip.id } },
      order: { date: 'ASC' },
    });

    for (let i = 0; i < allRemainingDays.length; i++) {
      if (allRemainingDays[i].dayIndex !== i + 1) {
        allRemainingDays[i].dayIndex = i + 1;
      }
    }
    await tripDayRepo.save(allRemainingDays);
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findDetail(id: string): Promise<TripDetailDto> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: [
        'user',
        'members',
        'members.user',
        'days',
        'days.items',
        'days.items.geo',
      ],
      order: {
        days: {
          dayIndex: 'ASC',
          items: {
            orderIndex: 'ASC',
          },
        },
      },
    });
    if (!trip) {
      throw new NotFoundException(this.notFoundMessage);
    }

    const totalEstimatedCost = this.calculateTotalCost(trip);
    const ownerId =
      trip.members?.find((member) => member.role === TripMemberRole.OWNER)?.user
        ?.id ?? null;

    return {
      id: trip.id,
      name: trip.name,
      description: trip.description,
      destination: this.deriveDestination(trip),
      coverImage: trip.coverImageUrl ?? null,
      startDate: trip.startDate.toISOString().split('T')[0],
      endDate: trip.endDate.toISOString().split('T')[0],
      status: trip.status,
      budget: trip.budget ?? 0,
      members: trip.members ?? [],
      days: this.mapTripDays(trip.days ?? []),
      totalEstimatedCost,
      totalActualCost: totalEstimatedCost,
      totalDays: trip.days?.length ?? 0,
      createdBy: ownerId ?? trip.user?.id ?? null,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
      deletedAt: trip.deletedAt ? trip.deletedAt.toISOString() : null,
    };
  }

  private mapTripDays(tripDays: TripDay[]): TripDayDetailDto[] {
    return tripDays.map((day) => ({
      id: day.id,
      dayIndex: day.dayIndex,
      date: day.date.toISOString().split('T')[0],
      note: day.note ?? null,
      items: this.mapTripItems(day.items ?? []),
    }));
  }

  private mapTripItems(tripItems: TripItem[]): TripItemDetailDto[] {
    return tripItems.map((item) => {
      const geo = item.geo;

      return {
        id: item.id,
        type: item.type,
        customName: item.customName ?? null,
        cost: item.cost ?? null,
        estimatedCost: item.estimatedCost ?? null,
        name: item.customName || geo?.name || 'Unnamed',
        durationMinutes: item.durationMinutes ?? null,
        startTime: item.startTime ?? null,
        endTime: item.endTime ?? null,
        address: geo?.address || null,
        googlePlaceId: geo?.googlePlaceId || null,
        lat: geo?.lat ? Number(geo.lat) : null,
        lng: geo?.lng ? Number(geo.lng) : null,
        maxDurationMinutes: geo?.maxDurationMinutes ?? null,
        minDurationMinutes: geo?.minDurationMinutes ?? null,
        phone: geo?.phone ?? null,
        standardClosingHours: geo?.standardClosingHours
          ? geo.standardClosingHours.toISOString()
          : null,
        standardOpeningHours: geo?.standardOpeningHours
          ? geo.standardOpeningHours.toISOString()
          : null,
        orderIndex: item.orderIndex,
        note: item.note ?? null,
      };
    });
  }

  private calculateTotalCost(trip: Trip): number {
    if (!trip.days?.length) {
      return 0;
    }
    return trip.days.reduce((daySum, day) => {
      if (!day.items?.length) {
        return daySum;
      }
      const itemsSum = day.items.reduce((itemSum, item) => {
        return itemSum + (item.cost ?? 0);
      }, 0);
      return daySum + itemsSum;
    }, 0);
  }

  private deriveDestination(trip: Trip): string | null {
    return (
      trip.days
        ?.find((day) => day.items?.length)
        ?.items?.find((item) => item.geo)?.geo?.name ?? null
    );
  }

  private ensureValidDateRange(startDate: Date, endDate: Date): void {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
  }

  private buildTripDays(
    trip: Trip,
    startDate: Date,
    endDate: Date,
  ): Array<Pick<TripDay, 'trip' | 'dayIndex' | 'date'>> {
    const days: Array<Pick<TripDay, 'trip' | 'dayIndex' | 'date'>> = [];
    const normalizedStart = this.normalizeDate(startDate);
    const normalizedEnd = this.normalizeDate(endDate);

    for (
      let dayIndex = 1, cursor = new Date(normalizedStart);
      cursor.getTime() <= normalizedEnd.getTime();
      cursor.setDate(cursor.getDate() + 1), dayIndex++
    ) {
      days.push({
        trip,
        dayIndex,
        date: new Date(cursor),
      });
    }

    return days;
  }

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private async setOwnerMember(trip: Trip, owner: User): Promise<void> {
    let member = await this.tripMemberRepository.findOne({
      where: {
        trip: { id: trip.id },
        role: TripMemberRole.OWNER,
      },
      relations: ['trip', 'user'],
    });

    if (!member) {
      member = this.tripMemberRepository.create({
        trip,
        user: owner,
        role: TripMemberRole.OWNER,
      });
    } else {
      member.user = owner;
    }

    await this.tripMemberRepository.save(member);
  }
}
