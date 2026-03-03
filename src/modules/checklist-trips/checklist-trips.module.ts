import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistTrip } from '@/modules/checklist-trips/entities/checklist-trip.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';
import { ChecklistTripItem } from '@/modules/checklist-trip-items/entities/checklist-trip-item.entity';
import { ChecklistTripsService } from '@/modules/checklist-trips/checklist-trips.service';
import { ChecklistTripsController } from '@/modules/checklist-trips/checklist-trips.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChecklistTrip,
      Trip,
      ChecklistUser,
      ChecklistTripItem,
    ]),
  ],
  controllers: [ChecklistTripsController],
  providers: [ChecklistTripsService],
  exports: [ChecklistTripsService],
})
export class ChecklistTripsModule {}
