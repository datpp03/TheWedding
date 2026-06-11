import 'reflect-metadata';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import mssqlMsNodeSqlV8 from 'mssql/msnodesqlv8';
import { buildTrustedConnectionString } from './typeorm.config';

loadEnv({ path: path.resolve(process.cwd(), '.env'), quiet: true });
loadEnv({ path: path.resolve(process.cwd(), '../../.env'), quiet: true });

const commonOptions = {
  type: 'mssql',
  entities: ['src/**/*.orm-entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const dataSourceOptions =
  process.env.SQLSERVER_AUTH_MODE === 'windows'
    ? {
        ...commonOptions,
        driver: mssqlMsNodeSqlV8,
        host: process.env.SQLSERVER_HOST ?? 'localhost',
        port: Number(process.env.SQLSERVER_PORT ?? 1433),
        database: process.env.SQLSERVER_DATABASE ?? 'TheWedding',
        extra: {
          connectionString: buildTrustedConnectionString({
            get<T = string>(key: string, defaultValue?: T) {
              return (process.env[key] ?? defaultValue) as T;
            },
          }),
        },
      }
    : {
        ...commonOptions,
        url: process.env.DATABASE_URL,
      };

export default new DataSource(dataSourceOptions as DataSourceOptions);
