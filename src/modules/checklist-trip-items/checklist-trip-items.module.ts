import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistTripItem } from '@/modules/checklist-trip-items/entities/checklist-trip-item.entity';
import { ChecklistTrip } from '@/modules/checklist-trips/entities/checklist-trip.entity';
import { User } from '@/modules/users/entities/user.entity';
import { ChecklistTripItemsService } from '@/modules/checklist-trip-items/checklist-trip-items.service';
import { ChecklistTripItemsController } from '@/modules/checklist-trip-items/checklist-trip-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistTripItem, ChecklistTrip, User])],
  controllers: [ChecklistTripItemsController],
  providers: [ChecklistTripItemsService],
  exports: [ChecklistTripItemsService],
})
export class ChecklistTripItemsModule {}
