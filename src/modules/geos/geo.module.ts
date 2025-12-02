import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { GeoService } from '@/modules/geos/geo.service';
import { GeoController } from '@/modules/geos/geo.controller';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Geo, GeoType])],
  controllers: [GeoController],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
