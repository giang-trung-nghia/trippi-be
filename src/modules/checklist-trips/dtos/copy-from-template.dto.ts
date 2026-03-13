import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CopyFromTemplateDto {
  @ApiProperty({ description: 'ID of the trip to add the checklist to' })
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @ApiProperty({ description: 'ID of the template to copy from' })
  @IsUUID()
  @IsNotEmpty()
  templateId: string;
}
