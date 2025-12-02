import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/modules/base/base.service';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { CreateGeoDto } from '@/modules/geos/dtos/create-geo.dto';
import { UpdateGeoDto } from '@/modules/geos/dtos/update-geo.dto';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';

@Injectable()
export class GeoService extends BaseService<Geo, CreateGeoDto, UpdateGeoDto> {
  constructor(
    @InjectRepository(Geo)
    private readonly geoRepository: Repository<Geo>,
    @InjectRepository(GeoType)
    private readonly geoTypeRepository: Repository<GeoType>,
  ) {
    super(geoRepository, 'Geo');
  }

  async create(createDto: CreateGeoDto): Promise<Geo> {
    const { parentId, geoTypeId, ...rest } = createDto;
    this.ensureValidDurationRange(
      createDto.minDurationMinutes,
      createDto.maxDurationMinutes,
    );

    const geo = this.geoRepository.create({
      ...rest,
      type: await this.findGeoType(geoTypeId),
      ...(parentId ? { parent: await this.findParent(parentId) } : {}),
    });

    return this.geoRepository.save(geo);
  }

  async update(id: string, updateDto: UpdateGeoDto): Promise<Geo> {
    const { parentId, geoTypeId, ...rest } = updateDto;
    this.ensureValidDurationRange(
      updateDto.minDurationMinutes,
      updateDto.maxDurationMinutes,
    );
    const payload: Partial<Geo> = { ...rest };

    if (parentId !== undefined) {
      payload.parent = parentId ? await this.findParent(parentId) : undefined;
    }

    if (geoTypeId) {
      payload.type = await this.findGeoType(geoTypeId);
    }

    const entityToSave: Partial<Geo> = {
      ...(payload as Geo),
      id,
    };
    await this.geoRepository.save(entityToSave);
    return this.findOne(id);
  }

  private async findParent(parentId: string): Promise<Geo> {
    const parent = await this.geoRepository.findOne({
      where: { id: parentId },
    });
    if (!parent) {
      throw new NotFoundException('Parent geo not found');
    }
    return parent;
  }

  private async findGeoType(geoTypeId: string): Promise<GeoType> {
    const geoType = await this.geoTypeRepository.findOne({
      where: { id: geoTypeId },
    });
    if (!geoType) {
      throw new NotFoundException('Geo type not found');
    }
    return geoType;
  }

  private ensureValidDurationRange(min?: number, max?: number): void {
    if (min !== undefined && max !== undefined && max < min) {
      throw new BadRequestException(
        'maxDurationMinutes must be greater than or equal to minDurationMinutes.',
      );
    }
  }

}
