import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class ReorderChecklistUserItemDto {
  @ApiProperty({ description: 'ID of the user checklist' })
  @IsUUID()
  @IsNotEmpty()
  checklistUserId: string;

  @ApiProperty({
    description: 'Array of item IDs in the desired order',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  itemIds: string[];
}
