import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class FilterChecklistTripsDto {
  @ApiPropertyOptional({
    description: 'Filter checklists by trip ID',
    example: '7dd2c737-27e7-4e55-9ed5-5c805ee6d54a',
  })
  @IsOptional()
  @IsUUID()
  tripId?: string;

  @ApiPropertyOptional({
    description: 'Include checklist items in the response',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsBoolean()
  includeItems?: boolean;
}
