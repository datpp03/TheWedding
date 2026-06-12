import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { MediaOrmEntity } from '../media/infrastructure/media.orm-entity';
import { AlbumsService } from './application/albums.service';
import { AlbumOrmEntity } from './infrastructure/album.orm-entity';
import { AlbumsController } from './presentation/albums.controller';

@Module({
  imports: [AuditLogsModule, TypeOrmModule.forFeature([AlbumOrmEntity, MediaOrmEntity])],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService, TypeOrmModule],
})
export class AlbumsModule {}
