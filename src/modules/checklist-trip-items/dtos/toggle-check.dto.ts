import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ToggleCheckDto {
  @ApiProperty({ description: 'ID of the user toggling the check' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
