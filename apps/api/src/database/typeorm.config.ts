import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createTypeOrmOptions(config: ConfigService): TypeOrmModuleOptions {
  const databaseUrl = config.getOrThrow<string>('DATABASE_URL');

  return {
    autoLoadEntities: true,
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: false,
    ssl: resolvePostgresSsl(
      databaseUrl,
      config.get<string>('DATABASE_SSL', 'auto'),
      config.get<string>('NODE_ENV', 'local'),
    ),
    synchronize: false,
    type: 'postgres',
    url: databaseUrl,
  };
}

export function resolvePostgresSsl(
  databaseUrl: string,
  mode = 'auto',
  nodeEnv = 'local',
): false | { rejectUnauthorized: false } {
  if (mode === 'false') {
    return false;
  }

  const shouldUseSsl =
    mode === 'true' || nodeEnv === 'production' || databaseUrl.includes('sslmode=require');

  return shouldUseSsl ? { rejectUnauthorized: false } : false;
}
