import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';
import { CreateTripItemDto } from '@/modules/trip-items/dtos/create-trip-item.dto';
import { UpdateTripItemDto } from '@/modules/trip-items/dtos/update-trip-item.dto';
import { BaseService } from '@/modules/base/services/base.service';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';

@Injectable()
export class TripItemsService extends BaseService<
  TripItem,
  CreateTripItemDto,
  UpdateTripItemDto
> {
  constructor(
    @InjectRepository(TripItem)
    private readonly tripItemRepository: Repository<TripItem>,
    @InjectRepository(TripDay)
    private readonly tripDayRepository: Repository<TripDay>,
    @InjectRepository(Geo)
    private readonly geoRepository: Repository<Geo>,
  ) {
    super(tripItemRepository, 'TripItem');
  }

  async create(createDto: CreateTripItemDto): Promise<TripItem> {
    const tripDay = await this.findTripDay(createDto.tripDayId);
    const geo = createDto.geoId
      ? await this.findGeo(createDto.geoId)
      : undefined;
    const { ...rest } = createDto;
    return super.create({
      ...rest,
      tripDay,
      ...(geo ? { geo } : {}),
    } as unknown as CreateTripItemDto);
  }

  async update(id: string, updateDto: UpdateTripItemDto): Promise<TripItem> {
    const payload: Record<string, unknown> = { ...updateDto };
    if (updateDto.tripDayId) {
      payload.tripDay = await this.findTripDay(updateDto.tripDayId);
    }
    if (updateDto.geoId) {
      payload.geo = await this.findGeo(updateDto.geoId);
    }
    return super.update(id, payload as UpdateTripItemDto);
  }

  private async findTripDay(id: string): Promise<TripDay> {
    const tripDay = await this.tripDayRepository.findOne({ where: { id } });
    if (!tripDay) {
      throw new NotFoundException('Trip day not found');
    }
    return tripDay;
  }

  private async findGeo(id: string): Promise<Geo> {
    const geo = await this.geoRepository.findOne({ where: { id } });
    if (!geo) {
      throw new NotFoundException('Geo not found');
    }
    return geo;
  }
}
