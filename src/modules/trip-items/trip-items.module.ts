import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { TripItemsService } from '@/modules/trip-items/trip-items.service';
import { TripItemsController } from '@/modules/trip-items/trip-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TripItem, TripDay, Geo])],
  controllers: [TripItemsController],
  providers: [TripItemsService],
  exports: [TripItemsService],
})
export class TripItemsModule {}
