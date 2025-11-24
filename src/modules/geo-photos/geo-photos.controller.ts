import { Controller } from '@nestjs/common';
import { BaseController } from '@/modules/base/base.controller';
import { GeoPhoto } from '@/modules/geo-photos/entities/geo-photo.entity';
import { CreateGeoPhotoDto } from '@/modules/geo-photos/dtos/create-geo-photo.dto';
import { UpdateGeoPhotoDto } from '@/modules/geo-photos/dtos/update-geo-photo.dto';
import { GeoPhotosService } from '@/modules/geo-photos/geo-photos.service';

@Controller('api/v1/geo-photos')
export class GeoPhotosController extends BaseController<
  GeoPhoto,
  CreateGeoPhotoDto,
  UpdateGeoPhotoDto
> {
  constructor(protected readonly geoPhotosService: GeoPhotosService) {
    super(geoPhotosService);
  }
}
