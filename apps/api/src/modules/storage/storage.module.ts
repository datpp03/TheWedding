import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { STORAGE_SERVICE } from './domain/storage.service';
import { LocalStorageService } from './infrastructure/local-storage.service';
import { StorageController } from './presentation/storage.controller';

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [
    LocalStorageService,
    {
      provide: STORAGE_SERVICE,
      useExisting: LocalStorageService,
    },
  ],
  exports: [STORAGE_SERVICE, LocalStorageService],
})
export class StorageModule {}
