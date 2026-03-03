import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CopyFromUserChecklistDto {
  @ApiProperty({ description: 'ID of the trip' })
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @ApiProperty({ description: 'ID of the user checklist to copy from' })
  @IsUUID()
  @IsNotEmpty()
  checklistUserId: string;
}
