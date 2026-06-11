import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import mssqlMsNodeSqlV8 from 'mssql/msnodesqlv8';

export function createTypeOrmOptions(config: ConfigService): TypeOrmModuleOptions {
  const commonOptions = {
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: false,
    migrations: ['dist/database/migrations/*.js'],
  };

  if (config.get<string>('SQLSERVER_AUTH_MODE') === 'windows') {
    return {
      ...commonOptions,
      type: 'mssql',
      driver: mssqlMsNodeSqlV8,
      host: config.get<string>('SQLSERVER_HOST', 'localhost'),
      port: config.get<number>('SQLSERVER_PORT', 1433),
      database: config.get<string>('SQLSERVER_DATABASE', 'TheWedding'),
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      extra: {
        connectionString: buildTrustedConnectionString(config),
      },
    };
  }

  return {
    ...commonOptions,
    type: 'mssql',
    url: config.getOrThrow<string>('DATABASE_URL'),
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
}

export function buildTrustedConnectionString(config: Pick<ConfigService, 'get'>) {
  const driver = config.get<string>('SQLSERVER_ODBC_DRIVER', 'ODBC Driver 18 for SQL Server');
  const host = config.get<string>('SQLSERVER_HOST', 'localhost');
  const port = config.get<number>('SQLSERVER_PORT', 1433);
  const database = config.get<string>('SQLSERVER_DATABASE', 'TheWedding');

  return [
    `Driver={${driver}}`,
    `Server=${host},${port}`,
    `Database=${database}`,
    'Trusted_Connection=Yes',
    'TrustServerCertificate=Yes',
    'Encrypt=No',
  ].join(';');
}
