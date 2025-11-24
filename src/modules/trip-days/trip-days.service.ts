import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { CreateTripDayDto } from '@/modules/trip-days/dtos/create-trip-day.dto';
import { UpdateTripDayDto } from '@/modules/trip-days/dtos/update-trip-day.dto';
import { BaseService } from '@/modules/base/services/base.service';

@Injectable()
export class TripDaysService extends BaseService<
  TripDay,
  CreateTripDayDto,
  UpdateTripDayDto
> {
  constructor(
    @InjectRepository(TripDay)
    private readonly tripDayRepository: Repository<TripDay>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {
    super(tripDayRepository, 'TripDay');
  }

  async create(createDto: CreateTripDayDto): Promise<TripDay> {
    const trip = await this.findTrip(createDto.tripId);
    const { date, ...rest } = createDto;
    return super.create({
      ...rest,
      date: new Date(date),
      trip,
    } as unknown as CreateTripDayDto);
  }

  async update(id: string, updateDto: UpdateTripDayDto): Promise<TripDay> {
    const payload: Record<string, unknown> = { ...updateDto };
    if (updateDto.tripId) {
      payload.trip = await this.findTrip(updateDto.tripId);
    }
    if (updateDto.date) {
      payload.date = new Date(updateDto.date);
    }
    return super.update(id, payload as UpdateTripDayDto);
  }

  private async findTrip(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }
}
