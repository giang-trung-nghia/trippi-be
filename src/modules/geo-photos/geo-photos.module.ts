import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoPhoto } from '@/modules/geo-photos/entities/geo-photo.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { GeoPhotosService } from '@/modules/geo-photos/geo-photos.service';
import { GeoPhotosController } from '@/modules/geo-photos/geo-photos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeoPhoto, Geo])],
  controllers: [GeoPhotosController],
  providers: [GeoPhotosService],
  exports: [GeoPhotosService],
})
export class GeoPhotosModule {}
