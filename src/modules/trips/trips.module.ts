import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { TripsService } from '@/modules/trips/trips.service';
import { TripsController } from '@/modules/trips/trips.controller';
import { User } from '@/modules/users/entities/user.entity';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripMember, User])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
