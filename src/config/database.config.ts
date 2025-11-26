import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
dotenv.config();

export const dataSourceOptions: DataSourceOptions & TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/modules/**/entities/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: ['error', 'warn'], // Log only error and warn queries to the console
  namingStrategy: new SnakeNamingStrategy(),
};

export const typeOrmConfig: TypeOrmModuleOptions = dataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
