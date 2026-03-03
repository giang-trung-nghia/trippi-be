import { PartialType } from '@nestjs/swagger';
import { CreateChecklistTripItemDto } from './create-checklist-trip-item.dto';

export class UpdateChecklistTripItemDto extends PartialType(
  CreateChecklistTripItemDto,
) {}
