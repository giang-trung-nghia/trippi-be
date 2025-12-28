import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';
import { CreateTripItemDto } from '@/modules/trip-items/dtos/create-trip-item.dto';
import { UpdateTripItemDto } from '@/modules/trip-items/dtos/update-trip-item.dto';
import { BaseService } from '@/modules/base/base.service';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';

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
    @InjectRepository(GeoType)
    private readonly geoTypeRepository: Repository<GeoType>,
  ) {
    super(tripItemRepository, 'TripItem');
  }

  async create(createDto: CreateTripItemDto): Promise<TripItem> {
    const tripDay = await this.findTripDay(createDto.tripDayId);
    const geo = createDto.googlePlaceId
      ? await this.findOrCreateGeoByGooglePlaceId(
          createDto.googlePlaceId,
          createDto.lat,
          createDto.lng,
          createDto.snapshot,
        )
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
    if (updateDto.googlePlaceId) {
      payload.geo = await this.findOrCreateGeoByGooglePlaceId(
        updateDto.googlePlaceId,
        updateDto.lat,
        updateDto.lng,
        updateDto.snapshot,
      );
    }
    return super.update(id, updateDto);
  }

  private async findTripDay(id: string): Promise<TripDay> {
    const tripDay = await this.tripDayRepository.findOne({ where: { id } });
    if (!tripDay) {
      throw new NotFoundException('Trip day not found');
    }
    return tripDay;
  }

  private async findOrCreateGeoByGooglePlaceId(
    googlePlaceId: string,
    lat: number,
    lng: number,
    snapshot?: Record<string, unknown>,
  ): Promise<Geo> {
    let geo = await this.geoRepository.findOne({ where: { googlePlaceId } });

    if (!geo) {
      // Get or create "unknown" geo type for places not yet categorized
      let unknownType = await this.geoTypeRepository.findOne({
        where: { googleType: 'unknown' },
      });

      if (!unknownType) {
        unknownType = this.geoTypeRepository.create({
          googleType: 'unknown',
          name: 'Unknown',
        });
        unknownType = await this.geoTypeRepository.save(unknownType);
      }

      // Create a new Geo with data from snapshot or placeholder values
      geo = this.geoRepository.create({
        googlePlaceId,
        name: (snapshot?.name as string) || googlePlaceId,
        address: (snapshot?.address as string) || undefined,
        lat,
        lng,
        rating: snapshot?.rating as number,
        phone: (snapshot?.phone as string) || undefined,
        website: (snapshot?.website as string) || undefined,
        type: unknownType,
      });

      geo = await this.geoRepository.save(geo);
    }

    return geo;
  }
}
