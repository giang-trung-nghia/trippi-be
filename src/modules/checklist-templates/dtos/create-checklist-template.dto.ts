import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ChecklistType } from '@/common/enums/checklist-type.enum';

export class CreateChecklistTemplateDto {
  @ApiProperty({ description: 'Name of the checklist template' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Type of the checklist template',
    enum: ChecklistType,
  })
  @IsEnum(ChecklistType)
  type: ChecklistType;
}
