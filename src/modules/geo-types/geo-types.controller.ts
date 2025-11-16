import { Controller } from '@nestjs/common';
import { BaseController } from '@/modules/base/base.controller';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';
import { CreateGeoTypeDto } from '@/modules/geo-types/dtos/create-geo-type.dto';
import { UpdateGeoTypeDto } from '@/modules/geo-types/dtos/update-geo-type.dto';
import { GeoTypesService } from '@/modules/geo-types/geo-types.service';

@Controller('api/v1/geo-types')
export class GeoTypesController extends BaseController<
  GeoType,
  CreateGeoTypeDto,
  UpdateGeoTypeDto
> {
  constructor(protected readonly geoTypesService: GeoTypesService) {
    super(geoTypesService);
  }
}

