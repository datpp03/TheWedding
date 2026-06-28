import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { STORAGE_SERVICE } from './domain/storage.service';
import { LocalStorageService } from './infrastructure/local-storage.service';
import { S3CompatibleStorageService } from './infrastructure/s3-compatible-storage.service';
import { StorageController } from './presentation/storage.controller';

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [
    LocalStorageService,
    S3CompatibleStorageService,
    {
      provide: STORAGE_SERVICE,
      inject: [ConfigService, LocalStorageService, S3CompatibleStorageService],
      useFactory: (
        config: ConfigService,
        localStorage: LocalStorageService,
        objectStorage: S3CompatibleStorageService,
      ) => {
        const provider = config.get<string>('STORAGE_PROVIDER', 'local');
        if (provider === 'r2' || provider === 's3') {
          objectStorage.assertConfigured();
          return objectStorage;
        }
        return localStorage;
      },
    },
  ],
  exports: [STORAGE_SERVICE, LocalStorageService, S3CompatibleStorageService],
})
export class StorageModule {}
