import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateChecklistTemplateItemDto {
  @ApiProperty({ description: 'Name of the checklist item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Order index of the item' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex: number;

  @ApiProperty({ description: 'ID of the checklist template' })
  @IsString()
  @IsNotEmpty()
  checklistTemplateId: string;
}
