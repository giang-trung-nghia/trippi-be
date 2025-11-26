import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

export interface PagedResult<Entity> {
  data: Entity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FindPagedOptions<Entity> {
  page?: number;
  limit?: number;
  where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
  relations?: FindOptionsRelations<Entity>;
  order?: FindOptionsOrder<Entity>;
}
