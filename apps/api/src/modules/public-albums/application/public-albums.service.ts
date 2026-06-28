import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ALBUM_VISIBILITY,
  MEDIA_PROCESSING_STATUS,
  MEDIA_TYPE,
  TENANT_STATUS,
  TENANT_VISIBILITY,
} from '@the-wedding/shared';
import { In, Repository } from 'typeorm';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import { AlbumOrmEntity } from '../../albums/infrastructure/album.orm-entity';
import { MediaOrmEntity } from '../../media/infrastructure/media.orm-entity';
import { TenantOrmEntity } from '../../tenants/infrastructure/tenant.orm-entity';
import { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import { AlbumFeaturedEntryOrmEntity } from '../infrastructure/album-featured-entry.orm-entity';
import { AlbumReactionSymbolOrmEntity } from '../infrastructure/album-reaction-symbol.orm-entity';
import { AlbumReactionOrmEntity } from '../infrastructure/album-reaction.orm-entity';
import { AlbumSearchMetadataOrmEntity } from '../infrastructure/album-search-metadata.orm-entity';
import { AlbumWishOrmEntity } from '../infrastructure/album-wish.orm-entity';
import type {
  AlbumSearchQueryDto,
  CreateReactionDto,
  CreateWishDto,
  UpdateReactionSymbolsDto,
} from '../presentation/public-albums.dto';

export type PublicAlbumContext = {
  actorUserId: string;
  email?: string;
  tenantIds: string[];
  ipAddress?: string;
  userAgent?: string;
};

const DEFAULT_SYMBOLS = [
  { glyph: 'heart', symbolKey: 'heart' },
  { glyph: 'star', symbolKey: 'star' },
  { glyph: 'flower', symbolKey: 'cherry_blossom' },
  { glyph: 'leaf', symbolKey: 'leaf' },
  { glyph: 'fish', symbolKey: 'fish' },
];

@Injectable()
export class PublicAlbumsService {
  constructor(
    @InjectRepository(AlbumOrmEntity)
    private readonly albums: Repository<AlbumOrmEntity>,
    @InjectRepository(MediaOrmEntity)
    private readonly media: Repository<MediaOrmEntity>,
    @InjectRepository(TenantOrmEntity)
    private readonly tenants: Repository<TenantOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(AlbumFeaturedEntryOrmEntity)
    private readonly featuredEntries: Repository<AlbumFeaturedEntryOrmEntity>,
    @InjectRepository(AlbumWishOrmEntity)
    private readonly wishes: Repository<AlbumWishOrmEntity>,
    @InjectRepository(AlbumReactionOrmEntity)
    private readonly reactions: Repository<AlbumReactionOrmEntity>,
    @InjectRepository(AlbumReactionSymbolOrmEntity)
    private readonly reactionSymbols: Repository<AlbumReactionSymbolOrmEntity>,
    @InjectRepository(AlbumSearchMetadataOrmEntity)
    private readonly searchMetadata: Repository<AlbumSearchMetadataOrmEntity>,
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogs: AuditLogRepository,
  ) {}

  async home() {
    const [today, week] = await Promise.all([this.featured('today', 6), this.featured('week', 9)]);

    return {
      featuredToday: today,
      featuredWeek: week,
      source: 'algorithm',
    };
  }

  async featured(window: 'today' | 'week' = 'week', limit = 9) {
    const curated = await this.featuredEntries.find({
      order: { score: 'DESC', createdAt: 'DESC' },
      take: limit,
      where: { window },
    });
    const curatedAlbumIds = curated.map((entry) => entry.albumId);
    const albums = curatedAlbumIds.length
      ? await this.albums.find({
          where: { id: In(curatedAlbumIds), visibility: ALBUM_VISIBILITY.PUBLIC },
        })
      : await this.albums.find({
          order: { createdAt: 'DESC' },
          take: limit,
          where: { visibility: ALBUM_VISIBILITY.PUBLIC },
        });
    const publicAlbums = await this.filterPublicTenantAlbums(albums);

    const sorted = curatedAlbumIds.length
      ? curatedAlbumIds
          .map((id) => publicAlbums.find((album) => album.id === id))
          .filter((album): album is AlbumOrmEntity => Boolean(album))
      : publicAlbums;

    return this.toPublicCards(sorted.slice(0, limit), 'algorithm');
  }

  async getPublicAlbum(albumId: string) {
    const album = await this.findPublicOrUnlistedAlbum(albumId);
    return this.toAlbumDetail(album);
  }

  async search(query: AlbumSearchQueryDto, context: PublicAlbumContext) {
    const limit = query.limit ?? 20;
    const builder = this.albums
      .createQueryBuilder('album')
      .innerJoin(TenantOrmEntity, 'tenant', 'tenant.id = album.tenantId')
      .leftJoin(AlbumSearchMetadataOrmEntity, 'metadata', 'metadata.albumId = album.id')
      .where('album.visibility = :visibility', { visibility: ALBUM_VISIBILITY.PUBLIC })
      .andWhere('album.deletedAt IS NULL')
      .andWhere('tenant.visibility = :tenantVisibility', {
        tenantVisibility: TENANT_VISIBILITY.PUBLIC,
      })
      .andWhere('tenant.status = :tenantStatus', { tenantStatus: TENANT_STATUS.ACTIVE })
      .andWhere('tenant.deletedAt IS NULL');

    if (query.region) {
      builder.andWhere('LOWER(metadata.region) LIKE :region', {
        region: `%${query.region.toLowerCase()}%`,
      });
    }
    if (query.venue) {
      builder.andWhere('LOWER(metadata.venue) LIKE :venue', {
        venue: `%${query.venue.toLowerCase()}%`,
      });
    }
    if (query.theme) {
      builder.andWhere('LOWER(metadata.theme) LIKE :theme', {
        theme: `%${query.theme.toLowerCase()}%`,
      });
    }
    if (query.ageMin !== undefined) {
      builder.andWhere('(metadata.ageMax IS NULL OR metadata.ageMax >= :ageMin)', {
        ageMin: query.ageMin,
      });
    }
    if (query.ageMax !== undefined) {
      builder.andWhere('(metadata.ageMin IS NULL OR metadata.ageMin <= :ageMax)', {
        ageMax: query.ageMax,
      });
    }
    if (query.from) {
      builder.andWhere('(metadata.eventDate IS NULL OR metadata.eventDate >= :from)', {
        from: query.from,
      });
    }
    if (query.to) {
      builder.andWhere('(metadata.eventDate IS NULL OR metadata.eventDate <= :to)', {
        to: query.to,
      });
    }

    const albums = await builder.orderBy('album.createdAt', 'DESC').take(limit).getMany();
    await this.auditLogs.append({
      action: 'album.search',
      actorUserId: context.actorUserId,
      entityType: 'album',
      metadata: { filters: Object.keys(query), resultCount: albums.length },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return this.toPublicCards(albums, 'search');
  }

  async listWishes(albumId: string) {
    await this.findPublicOrUnlistedAlbum(albumId);
    const rows = await this.wishes.find({
      order: { createdAt: 'DESC' },
      take: 50,
      where: { albumId, status: 'visible' },
    });
    return rows.map((wish) => ({
      id: wish.id,
      albumId: wish.albumId,
      displayName: wish.displayNameSnapshot,
      message: wish.message,
      createdAt: wish.createdAt,
    }));
  }

  async createWish(albumId: string, input: CreateWishDto, context: PublicAlbumContext) {
    const album = await this.findPublicOrUnlistedAlbum(albumId);
    const existing = await this.wishes.findOne({ where: { albumId, userId: context.actorUserId } });
    if (existing) {
      throw new ConflictException('You have already sent a wish for this album');
    }
    const user = await this.users.findOne({ where: { id: context.actorUserId } });
    const wish = await this.wishes.save(
      this.wishes.create({
        albumId,
        displayNameSnapshot: user?.displayName ?? context.email ?? 'Guest',
        message: input.message.trim(),
        status: 'visible',
        tenantId: album.tenantId,
        userId: context.actorUserId,
      }),
    );
    await this.audit(album, 'album.wish.created', context, wish.id);
    return {
      id: wish.id,
      albumId,
      displayName: wish.displayNameSnapshot,
      message: wish.message,
      createdAt: wish.createdAt,
    };
  }

  async listReactionSummary(albumId: string) {
    const album = await this.findPublicOrUnlistedAlbum(albumId);
    const [symbols, reactions] = await Promise.all([
      this.listReactionSymbols(album.tenantId, album.id),
      this.reactions.find({ where: { albumId } }),
    ]);
    return symbols.map((symbol) => ({
      ...symbol,
      count: reactions.filter((reaction) => reaction.symbolKey === symbol.symbolKey).length,
    }));
  }

  async createReaction(albumId: string, input: CreateReactionDto, context: PublicAlbumContext) {
    const album = await this.findPublicOrUnlistedAlbum(albumId);
    const symbols = await this.listReactionSymbols(album.tenantId, album.id);
    if (!symbols.some((symbol) => symbol.symbolKey === input.symbolKey)) {
      await this.audit(album, 'album.reaction.suspicious_symbol', context, undefined, {
        symbolKey: input.symbolKey,
      });
      throw new BadRequestException('Reaction symbol is not allowed for this album');
    }
    const existing = await this.reactions.findOne({
      where: { albumId, symbolKey: input.symbolKey, userId: context.actorUserId },
    });
    if (existing) {
      throw new ConflictException('You have already reacted with this symbol');
    }
    const reaction = await this.reactions.save(
      this.reactions.create({
        albumId,
        symbolKey: input.symbolKey,
        tenantId: album.tenantId,
        userId: context.actorUserId,
      }),
    );
    await this.audit(album, 'album.reaction.created', context, reaction.id, {
      symbolKey: input.symbolKey,
    });
    return this.listReactionSummary(albumId);
  }

  async getReactionSymbols(tenantId: string, albumId: string, context: PublicAlbumContext) {
    this.assertTenantAccess(tenantId, context);
    await this.findOwnedAlbum(tenantId, albumId);
    return this.listReactionSymbols(tenantId, albumId);
  }

  async updateReactionSymbols(
    tenantId: string,
    albumId: string,
    input: UpdateReactionSymbolsDto,
    context: PublicAlbumContext,
  ) {
    this.assertTenantAccess(tenantId, context);
    await this.findOwnedAlbum(tenantId, albumId);
    await this.reactionSymbols.delete({ albumId, tenantId });
    const rows = await this.reactionSymbols.save(
      input.symbols.map((symbol, sortOrder) =>
        this.reactionSymbols.create({
          albumId,
          glyph: symbol.glyph,
          sortOrder,
          symbolKey: symbol.symbolKey,
          tenantId,
        }),
      ),
    );
    await this.auditLogs.append({
      action: 'album.reaction_symbols_updated',
      actorUserId: context.actorUserId,
      entityId: albumId,
      entityType: 'album',
      ipAddress: context.ipAddress,
      metadata: { symbolKeys: rows.map((row) => row.symbolKey) },
      tenantId,
      userAgent: context.userAgent,
    });
    return rows.map((row) => ({ glyph: row.glyph, symbolKey: row.symbolKey }));
  }

  private async findPublicOrUnlistedAlbum(albumId: string) {
    const album = await this.albums.findOne({ where: { id: albumId } });
    if (!album || album.visibility === ALBUM_VISIBILITY.PRIVATE) {
      throw new NotFoundException('Album not found');
    }
    const tenant = await this.tenants.findOne({
      where: {
        id: album.tenantId,
        status: TENANT_STATUS.ACTIVE,
        visibility: TENANT_VISIBILITY.PUBLIC,
      },
    });
    if (!tenant) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  private async findOwnedAlbum(tenantId: string, albumId: string) {
    const album = await this.albums.findOne({ where: { id: albumId, tenantId } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  private async filterPublicTenantAlbums(albums: AlbumOrmEntity[]) {
    if (!albums.length) return [];
    const tenantIds = [...new Set(albums.map((album) => album.tenantId))];
    const tenants = await this.tenants.find({
      where: {
        id: In(tenantIds),
        status: TENANT_STATUS.ACTIVE,
        visibility: TENANT_VISIBILITY.PUBLIC,
      },
    });
    const publicTenantIds = new Set(tenants.map((tenant) => tenant.id));
    return albums.filter((album) => publicTenantIds.has(album.tenantId));
  }

  private async toPublicCards(albums: AlbumOrmEntity[], source: string) {
    return Promise.all(albums.map((album) => this.toPublicCard(album, source)));
  }

  private async toPublicCard(album: AlbumOrmEntity, source: string) {
    const [tenant, mediaCount, cover, wishes, reactions] = await Promise.all([
      this.tenants.findOne({ where: { id: album.tenantId } }),
      this.media.count({ where: { albumId: album.id, tenantId: album.tenantId } }),
      this.findCover(album),
      this.wishes.count({ where: { albumId: album.id, status: 'visible' } }),
      this.reactions.count({ where: { albumId: album.id } }),
    ]);
    return {
      id: album.id,
      tenantId: album.tenantId,
      tenantSlug: tenant?.slug ?? '',
      title: album.title,
      description: album.description,
      coverUrl: cover ? resolvePublicMediaUrl(cover, 'thumbnail') : null,
      mediaCount,
      reactionCount: reactions,
      source,
      visibility: album.visibility,
      wishCount: wishes,
    };
  }

  private async toAlbumDetail(album: AlbumOrmEntity) {
    const [card, media, wishes, reactions, symbols] = await Promise.all([
      this.toPublicCard(
        album,
        album.visibility === ALBUM_VISIBILITY.UNLISTED ? 'direct_link' : 'public',
      ),
      this.media.find({
        order: { sortOrder: 'ASC', createdAt: 'ASC' },
        where: { albumId: album.id, tenantId: album.tenantId },
      }),
      this.listWishes(album.id),
      this.listReactionSummary(album.id),
      this.listReactionSymbols(album.tenantId, album.id),
    ]);
    return {
      ...card,
      allowDownload: Boolean(album.allowDownload),
      media: media.map((item) => {
        const publicUrl = resolvePublicMediaUrl(item, 'gallery');
        return {
          albumId: item.albumId,
          id: item.id,
          originalFileName: item.originalFileName,
          processingStatus: item.processingStatus,
          publicUrl,
          tenantId: item.tenantId,
          thumbnailUrl: item.thumbnailUrl ?? publicUrl,
          title: item.title,
          type: item.type,
        };
      }),
      reactions,
      symbols,
      wishes,
    };
  }

  private async findCover(album: AlbumOrmEntity) {
    if (album.coverMediaId) {
      return this.media.findOne({ where: { id: album.coverMediaId, tenantId: album.tenantId } });
    }
    return this.media.findOne({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      where: { albumId: album.id, tenantId: album.tenantId },
    });
  }

  private async listReactionSymbols(tenantId: string, albumId: string) {
    const rows = await this.reactionSymbols.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      where: { albumId, tenantId },
    });
    return (rows.length ? rows : DEFAULT_SYMBOLS).map((row) => ({
      glyph: row.glyph,
      symbolKey: row.symbolKey,
    }));
  }

  private assertTenantAccess(tenantId: string, context: PublicAlbumContext) {
    if (!context.tenantIds.includes(tenantId)) {
      throw new ForbiddenException('Tenant access denied');
    }
  }

  private audit(
    album: AlbumOrmEntity,
    action: string,
    context: PublicAlbumContext,
    entityId?: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.auditLogs.append({
      action,
      actorUserId: context.actorUserId,
      entityId,
      entityType: 'album',
      ipAddress: context.ipAddress,
      metadata,
      tenantId: album.tenantId,
      userAgent: context.userAgent,
    });
  }
}

function resolvePublicMediaUrl(media: MediaOrmEntity, preferred: 'gallery' | 'thumbnail') {
  if (preferred === 'thumbnail' && media.thumbnailUrl) return media.thumbnailUrl;
  if (media.optimizedUrl) return media.optimizedUrl;
  if (preferred === 'gallery' && media.thumbnailUrl) return media.thumbnailUrl;
  if (media.type === MEDIA_TYPE.IMAGE && media.processingStatus === MEDIA_PROCESSING_STATUS.READY) {
    return `/api/v1/public/tenants/${media.tenantId}/media/${media.id}/file`;
  }
  return null;
}
