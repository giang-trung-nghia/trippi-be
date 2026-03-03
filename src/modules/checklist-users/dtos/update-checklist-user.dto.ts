import { PartialType } from '@nestjs/swagger';
import { CreateChecklistUserDto } from './create-checklist-user.dto';

export class UpdateChecklistUserDto extends PartialType(
  CreateChecklistUserDto,
) {}
