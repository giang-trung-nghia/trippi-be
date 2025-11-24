import { Controller } from '@nestjs/common';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';
import { CreateTripItemDto } from '@/modules/trip-items/dtos/create-trip-item.dto';
import { UpdateTripItemDto } from '@/modules/trip-items/dtos/update-trip-item.dto';
import { TripItemsService } from '@/modules/trip-items/trip-items.service';
import { BaseController } from '@/modules/base/base.controller';

@Controller('api/v1/trip-items')
export class TripItemsController extends BaseController<
  TripItem,
  CreateTripItemDto,
  UpdateTripItemDto
> {
  constructor(protected readonly tripItemsService: TripItemsService) {
    super(tripItemsService);
  }
}
