import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';
import { GeoTypesService } from '@/modules/geo-types/geo-types.service';
import { GeoTypesController } from '@/modules/geo-types/geo-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeoType])],
  controllers: [GeoTypesController],
  providers: [GeoTypesService],
  exports: [GeoTypesService],
})
export class GeoTypesModule {}

