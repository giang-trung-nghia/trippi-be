import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class ReorderTripItemDto {
  @ApiProperty({
    description: 'The ID of the trip day containing the items',
    example: '0c95775c-43d5-4aaa-8768-2a043ae1b3f0',
  })
  @IsUUID()
  @IsNotEmpty()
  tripDayId: string;

  @ApiProperty({
    description: 'Array of trip item IDs in the desired order',
    example: [
      'd25fc553-549b-4251-8b9c-5f75fd95ee89',
      'a4c8786d-6279-4875-af82-3b5f2f1102aa',
      '72d5d9ec-7950-4712-bf88-7bedd44886f2',
    ],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  itemIds: string[];
}
