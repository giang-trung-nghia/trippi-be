import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<
  Entity extends ObjectLiteral,
  CreateDto extends DeepPartial<Entity> = DeepPartial<Entity>,
  UpdateDto extends DeepPartial<Entity> = DeepPartial<Entity>,
> {
  protected constructor(
    protected readonly repository: Repository<Entity>,
    private readonly entityDisplayName?: string,
  ) {}

  protected get entityName(): string {
    return (
      this.entityDisplayName ??
      this.repository.metadata?.name ??
      this.repository.metadata?.tableName ??
      'Entity'
    );
  }

  protected get notFoundMessage(): string {
    return `${this.entityName} not found`;
  }

  protected ensureAffected(result: DeleteResult | UpdateResult): void {
    if (!result.affected) {
      throw new NotFoundException(this.notFoundMessage);
    }
  }

  protected async findByIdOrFail(id: string): Promise<Entity> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<Entity>,
    });
    if (!entity) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return entity;
  }

  findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Entity> {
    return this.findByIdOrFail(id);
  }

  async create(createDto: CreateDto): Promise<Entity> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async createMany(createDtos: CreateDto[]): Promise<Entity[]> {
    const entities = this.repository.create(createDtos);
    return this.repository.save(entities);
  }

  async update(id: string, updateDto: UpdateDto): Promise<Entity> {
    const result = await this.repository.update(
      id,
      updateDto as QueryDeepPartialEntity<Entity>,
    );
    this.ensureAffected(result);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    this.ensureAffected(result);
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repository.softDelete(id);
    this.ensureAffected(result);
  }

  async restore(id: string): Promise<void> {
    const result = await this.repository.restore(id);
    this.ensureAffected(result);
  }
}

