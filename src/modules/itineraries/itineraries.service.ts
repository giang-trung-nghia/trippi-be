import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/modules/base/services/base.service';
import { Itinerary } from '@/modules/itineraries/entities/itinerary.entity';
import { CreateItineraryDto } from '@/modules/itineraries/dtos/create-itinerary.dto';
import { UpdateItineraryDto } from '@/modules/itineraries/dtos/update-itinerary.dto';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';

@Injectable()
export class ItinerariesService extends BaseService<
  Itinerary,
  CreateItineraryDto,
  UpdateItineraryDto
> {
  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Geo)
    private readonly geoRepository: Repository<Geo>,
  ) {
    super(itineraryRepository, 'Itinerary');
  }

  async create(createDto: CreateItineraryDto): Promise<Itinerary> {
    const trip = await this.findTrip(createDto.tripId);
    const geo = await this.findGeo(createDto.geoId);

    const { tripId, geoId, ...rest } = createDto;
    return super.create({
      ...rest,
      trip,
      ...(geo ? { geo } : {}),
    } as unknown as CreateItineraryDto);
  }

  async update(id: string, updateDto: UpdateItineraryDto): Promise<Itinerary> {
    const { tripId, geoId, ...rest } = updateDto;
    const payload: Record<string, unknown> = { ...rest };

    if (tripId) {
      payload.trip = await this.findTrip(tripId);
    }

    if (geoId !== undefined) {
      payload.geo = await this.findGeo(geoId);
    }

    return super.update(id, payload as UpdateItineraryDto);
  }

  private async findTrip(tripId: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  private async findGeo(geoId?: string): Promise<Geo | null> {
    if (!geoId) return null;
    const geo = await this.geoRepository.findOne({ where: { id: geoId } });
    if (!geo) {
      throw new NotFoundException('Geo not found');
    }
    return geo;
  }
}

