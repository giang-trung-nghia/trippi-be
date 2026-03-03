import { PartialType } from '@nestjs/swagger';
import { CreateChecklistTripDto } from './create-checklist-trip.dto';

export class UpdateChecklistTripDto extends PartialType(
  CreateChecklistTripDto,
) {}
