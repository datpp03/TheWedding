import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumOrmEntity } from '../albums/infrastructure/album.orm-entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { StorageModule } from '../storage/storage.module';
import { TenantOrmEntity } from '../tenants/infrastructure/tenant.orm-entity';
import { MediaService } from './application/media.service';
import { MediaVersionOrmEntity } from './infrastructure/media-version.orm-entity';
import { MediaOrmEntity } from './infrastructure/media.orm-entity';
import { MediaController } from './presentation/media.controller';

@Module({
  imports: [
    AuditLogsModule,
    StorageModule,
    TypeOrmModule.forFeature([
      AlbumOrmEntity,
      MediaOrmEntity,
      MediaVersionOrmEntity,
      TenantOrmEntity,
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService, TypeOrmModule],
})
export class MediaModule {}
