import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ChecklistType } from '@/common/enums/checklist-type.enum';

export class FilterChecklistTemplatesDto {
  @ApiPropertyOptional({
    description: 'Filter templates by checklist type',
    enum: ChecklistType,
  })
  @IsOptional()
  @IsEnum(ChecklistType)
  type?: ChecklistType;
}
