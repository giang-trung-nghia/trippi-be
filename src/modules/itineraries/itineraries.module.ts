import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItinerariesService } from '@/modules/itineraries/itineraries.service';
import { ItinerariesController } from '@/modules/itineraries/itineraries.controller';
import { Itinerary } from '@/modules/itineraries/entities/itinerary.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Itinerary, Trip, Geo])],
  controllers: [ItinerariesController],
  providers: [ItinerariesService],
  exports: [ItinerariesService],
})
export class ItinerariesModule {}

