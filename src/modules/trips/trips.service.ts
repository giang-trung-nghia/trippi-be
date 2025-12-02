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
import { User } from '@/modules/users/entities/user.entity';
import { BaseService } from '@/modules/base/base.service';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
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
    const { userId, ...rest } = updateDto;
    const payload: Record<string, unknown> = { ...rest };
    let newOwner: User | undefined;

    if (rest.startDate) {
      payload.startDate = new Date(rest.startDate);
    }
    if (rest.endDate) {
      payload.endDate = new Date(rest.endDate);
    }

    const nextStart = (payload.startDate as Date) ?? trip.startDate;
    const nextEnd = (payload.endDate as Date) ?? trip.endDate;
    this.ensureValidDateRange(nextStart, nextEnd);

    if (userId) {
      newOwner = await this.findUser(userId);
      payload.user = newOwner;
    }

    this.tripRepository.merge(trip, payload as UpdateTripDto);
    const savedTrip = await this.tripRepository.save(trip);

    if (newOwner) {
      await this.setOwnerMember(savedTrip, newOwner);
    }

    return savedTrip;
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
      members: trip.members ?? [],
      days: trip.days ?? [],
      totalEstimatedCost,
      totalActualCost: totalEstimatedCost,
      totalDays: trip.days?.length ?? 0,
      createdBy: ownerId ?? trip.user?.id ?? null,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
      deletedAt: trip.deletedAt ? trip.deletedAt.toISOString() : null,
    };
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
