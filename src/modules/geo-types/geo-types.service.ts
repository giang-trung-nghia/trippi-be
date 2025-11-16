import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/modules/base/services/base.service';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';
import { CreateGeoTypeDto } from '@/modules/geo-types/dtos/create-geo-type.dto';
import { UpdateGeoTypeDto } from '@/modules/geo-types/dtos/update-geo-type.dto';

@Injectable()
export class GeoTypesService extends BaseService<
  GeoType,
  CreateGeoTypeDto,
  UpdateGeoTypeDto
> {
  constructor(
    @InjectRepository(GeoType)
    private readonly geoTypeRepository: Repository<GeoType>,
  ) {
    super(geoTypeRepository, 'GeoType');
  }

  async create(createDto: CreateGeoTypeDto): Promise<GeoType> {
    return super.create(this.normalizeDto(createDto));
  }

  async update(
    id: string,
    updateDto: UpdateGeoTypeDto,
  ): Promise<GeoType> {
    return super.update(id, this.normalizeDto(updateDto));
  }

  private normalizeDto<T extends CreateGeoTypeDto | UpdateGeoTypeDto>(
    dto: T,
  ): T {
    if (dto.googleType) {
      dto.googleType = dto.googleType.toLowerCase();
    }
    return dto;
  }
}

