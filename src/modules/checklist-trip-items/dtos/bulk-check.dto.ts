import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class BulkCheckDto {
  @ApiProperty({
    description: 'Array of item IDs to check',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  itemIds: string[];

  @ApiProperty({ description: 'ID of the user checking the items' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
