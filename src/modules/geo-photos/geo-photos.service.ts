import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { GeoPhoto } from '@/modules/geo-photos/entities/geo-photo.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { BaseService } from '@/modules/base/base.service';
import { CreateGeoPhotoDto } from '@/modules/geo-photos/dtos/create-geo-photo.dto';
import { UpdateGeoPhotoDto } from '@/modules/geo-photos/dtos/update-geo-photo.dto';

@Injectable()
export class GeoPhotosService extends BaseService<
  GeoPhoto,
  CreateGeoPhotoDto,
  UpdateGeoPhotoDto
> {
  constructor(
    @InjectRepository(GeoPhoto)
    private readonly geoPhotoRepository: Repository<GeoPhoto>,
    @InjectRepository(Geo)
    private readonly geoRepository: Repository<Geo>,
  ) {
    super(geoPhotoRepository, 'Geo photo');
  }

  async create(createDto: CreateGeoPhotoDto): Promise<GeoPhoto> {
    const geo = await this.findGeoOrThrow(createDto.geoId);
    const entity = this.geoPhotoRepository.create({
      photoUrl: createDto.photoUrl,
      geo,
    });
    return this.geoPhotoRepository.save(entity);
  }

  async update(id: string, updateDto: UpdateGeoPhotoDto): Promise<GeoPhoto> {
    const { geoId, ...rest } = updateDto;
    let geo: Geo | undefined;
    if (geoId) {
      geo = await this.findGeoOrThrow(geoId);
    }
    const payload: DeepPartial<GeoPhoto> = {
      ...rest,
      ...(geo ? { geo } : {}),
    };
    const result = await this.geoPhotoRepository.update(
      id,
      payload as QueryDeepPartialEntity<GeoPhoto>,
    );
    this.ensureAffected(result);
    return this.findOne(id);
  }

  private async findGeoOrThrow(id: string): Promise<Geo> {
    const geo = await this.geoRepository.findOne({ where: { id } });
    if (!geo) {
      throw new NotFoundException('Geo not found');
    }
    return geo;
  }
}
