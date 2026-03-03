import { PartialType } from '@nestjs/swagger';
import { CreateChecklistUserItemDto } from './create-checklist-user-item.dto';

export class UpdateChecklistUserItemDto extends PartialType(
  CreateChecklistUserItemDto,
) {}
