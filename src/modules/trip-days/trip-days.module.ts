import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { TripDaysService } from '@/modules/trip-days/trip-days.service';
import { TripDaysController } from '@/modules/trip-days/trip-days.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TripDay, Trip])],
  controllers: [TripDaysController],
  providers: [TripDaysService],
  exports: [TripDaysService],
})
export class TripDaysModule {}
