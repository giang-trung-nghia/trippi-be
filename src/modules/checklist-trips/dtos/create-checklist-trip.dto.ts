import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChecklistTripDto {
  @ApiProperty({ description: 'Name of the checklist' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID of the trip' })
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @ApiPropertyOptional({
    description: 'ID of the user checklist this was copied from',
  })
  @IsUUID()
  @IsOptional()
  checklistUserId?: string;
}
