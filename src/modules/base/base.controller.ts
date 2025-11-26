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
  Query,
} from '@nestjs/common';
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { BaseService } from '@/modules/base/base.service';
import { PagedResult } from '@/modules/base/interfaces/base-service.interfaces';

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

  @Get('paged')
  findPaged(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
  ): Promise<PagedResult<Entity>> {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    return this.service.findPaged({
      page: Number.isNaN(parsedPage) ? undefined : parsedPage,
      limit: Number.isNaN(parsedLimit) ? undefined : parsedLimit,
    });
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
