import { Controller } from '@nestjs/common';
import { BaseController } from '@/modules/base/base.controller';
import { Itinerary } from '@/modules/itineraries/entities/itinerary.entity';
import { CreateItineraryDto } from '@/modules/itineraries/dtos/create-itinerary.dto';
import { UpdateItineraryDto } from '@/modules/itineraries/dtos/update-itinerary.dto';
import { ItinerariesService } from '@/modules/itineraries/itineraries.service';

@Controller('api/v1/itineraries')
export class ItinerariesController extends BaseController<
  Itinerary,
  CreateItineraryDto,
  UpdateItineraryDto
> {
  constructor(protected readonly itinerariesService: ItinerariesService) {
    super(itinerariesService);
  }
}

