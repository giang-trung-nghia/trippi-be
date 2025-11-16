import { Controller } from '@nestjs/common';
import { BaseController } from '@/modules/base/base.controller';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { CreateGeoDto } from '@/modules/geos/dtos/create-geo.dto';
import { UpdateGeoDto } from '@/modules/geos/dtos/update-geo.dto';
import { GeoService } from '@/modules/geos/geo.service';

@Controller('api/v1/geo')
export class GeoController extends BaseController<
  Geo,
  CreateGeoDto,
  UpdateGeoDto
> {
  constructor(protected readonly geoService: GeoService) {
    super(geoService);
  }
}

