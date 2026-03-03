import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class ReorderChecklistTripItemDto {
  @ApiProperty({ description: 'ID of the trip checklist' })
  @IsUUID()
  @IsNotEmpty()
  checklistTripId: string;

  @ApiProperty({
    description: 'Array of item IDs in the desired order',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  itemIds: string[];
}
