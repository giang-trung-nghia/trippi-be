import { Controller } from '@nestjs/common';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { CreateTripDayDto } from '@/modules/trip-days/dtos/create-trip-day.dto';
import { UpdateTripDayDto } from '@/modules/trip-days/dtos/update-trip-day.dto';
import { TripDaysService } from '@/modules/trip-days/trip-days.service';
import { BaseController } from '@/modules/base/base.controller';

@Controller('api/v1/trip-days')
export class TripDaysController extends BaseController<
  TripDay,
  CreateTripDayDto,
  UpdateTripDayDto
> {
  constructor(protected readonly tripDaysService: TripDaysService) {
    super(tripDaysService);
  }
}
