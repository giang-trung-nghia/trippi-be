import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BaseController } from '@/modules/base/base.controller';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { CreateTripDto } from '@/modules/trips/dtos/create-trip.dto';
import { UpdateTripDto } from '@/modules/trips/dtos/update-trip.dto';
import { TripDetailDto } from '@/modules/trips/dtos/trip-detail.dto';
import { TripsService } from '@/modules/trips/trips.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('api/v1/trips')
@UseGuards(JwtAuthGuard)
export class TripsController extends BaseController<
  Trip,
  CreateTripDto,
  UpdateTripDto
> {
  constructor(protected readonly tripsService: TripsService) {
    super(tripsService);
  }

  @Get(':id')
  findDetail(@Param('id') id: string): Promise<TripDetailDto> {
    return this.tripsService.findDetail(id);
  }
}
