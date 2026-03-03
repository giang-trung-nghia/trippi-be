import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChecklistUserDto {
  @ApiProperty({ description: 'Name of the checklist' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID of the user' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'ID of the template this checklist was copied from',
  })
  @IsUUID()
  @IsOptional()
  templateId?: string;
}
