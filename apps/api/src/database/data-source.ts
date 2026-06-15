import 'reflect-metadata';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { resolvePostgresSsl } from './typeorm.config';

loadEnv({ path: path.resolve(process.cwd(), '.env'), quiet: true });
loadEnv({ path: path.resolve(process.cwd(), '../../.env'), quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for PostgreSQL connections');
}

const dataSourceOptions = {
  entities: ['src/**/*.orm-entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  ssl: resolvePostgresSsl(
    databaseUrl,
    process.env.DATABASE_SSL ?? 'auto',
    process.env.NODE_ENV ?? 'local',
  ),
  synchronize: false,
  type: 'postgres',
  url: databaseUrl,
};

export default new DataSource(dataSourceOptions as DataSourceOptions);
