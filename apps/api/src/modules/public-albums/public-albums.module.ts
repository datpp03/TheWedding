import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumOrmEntity } from '../albums/infrastructure/album.orm-entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { MediaOrmEntity } from '../media/infrastructure/media.orm-entity';
import { TenantOrmEntity } from '../tenants/infrastructure/tenant.orm-entity';
import { UserOrmEntity } from '../users/infrastructure/user.orm-entity';
import { PublicAlbumsService } from './application/public-albums.service';
import { AlbumFeaturedEntryOrmEntity } from './infrastructure/album-featured-entry.orm-entity';
import { AlbumReactionSymbolOrmEntity } from './infrastructure/album-reaction-symbol.orm-entity';
import { AlbumReactionOrmEntity } from './infrastructure/album-reaction.orm-entity';
import { AlbumSearchMetadataOrmEntity } from './infrastructure/album-search-metadata.orm-entity';
import { AlbumWishOrmEntity } from './infrastructure/album-wish.orm-entity';
import { PublicAlbumsController } from './presentation/public-albums.controller';

@Module({
  controllers: [PublicAlbumsController],
  imports: [
    AuditLogsModule,
    TypeOrmModule.forFeature([
      AlbumFeaturedEntryOrmEntity,
      AlbumOrmEntity,
      AlbumReactionOrmEntity,
      AlbumReactionSymbolOrmEntity,
      AlbumSearchMetadataOrmEntity,
      AlbumWishOrmEntity,
      MediaOrmEntity,
      TenantOrmEntity,
      UserOrmEntity,
    ]),
  ],
  providers: [PublicAlbumsService],
})
export class PublicAlbumsModule {}
