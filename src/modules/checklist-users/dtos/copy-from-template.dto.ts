import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserCopyChecklistFromTemplateDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID of the template to copy from' })
  @IsUUID()
  @IsNotEmpty()
  templateId: string;
}
