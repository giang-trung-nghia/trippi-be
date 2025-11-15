import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { BaseService } from '@/modules/base/services/base.service';

export abstract class BaseController<
  Entity extends ObjectLiteral,
  CreateDto extends DeepPartial<Entity> = DeepPartial<Entity>,
  UpdateDto extends DeepPartial<Entity> = DeepPartial<Entity>,
> {
  protected constructor(
    protected readonly service: BaseService<Entity, CreateDto, UpdateDto>,
  ) {}

  @Get()
  findAll(): Promise<Entity[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Entity> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateDto): Promise<Entity> {
    return this.service.create(createDto);
  }

  @Post('bulk')
  createMany(@Body() createDtos: CreateDto[]): Promise<Entity[]> {
    if (!this.service.createMany) {
      throw new MethodNotAllowedException(
        'Bulk create is not supported for this resource.',
      );
    }
    return this.service.createMany(createDtos);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ): Promise<Entity> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Delete(':id/soft')
  @HttpCode(HttpStatus.NO_CONTENT)
  softDelete(@Param('id') id: string): Promise<void> {
    if (!this.service.softDelete) {
      throw new MethodNotAllowedException(
        'Soft delete is not supported for this resource.',
      );
    }
    return this.service.softDelete(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  restore(@Param('id') id: string): Promise<void> {
    if (!this.service.restore) {
      throw new MethodNotAllowedException(
        'Restore is not supported for this resource.',
      );
    }
    return this.service.restore(id);
  }
}

