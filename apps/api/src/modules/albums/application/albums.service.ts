import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ALBUM_VISIBILITY, MEDIA_TYPE } from '@the-wedding/shared';
import { In, Repository } from 'typeorm';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import { MediaOrmEntity } from '../../media/infrastructure/media.orm-entity';
import { AlbumOrmEntity } from '../infrastructure/album.orm-entity';
import type { CreateAlbumDto, UpdateAlbumDto } from '../presentation/album.dto';

export type AlbumContext = {
  actorUserId: string;
  tenantIds: string[];
  ipAddress?: string;
  userAgent?: string;
};

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumOrmEntity)
    private readonly albums: Repository<AlbumOrmEntity>,
    @InjectRepository(MediaOrmEntity)
    private readonly media: Repository<MediaOrmEntity>,
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogs: AuditLogRepository,
  ) {}

  async list(tenantId: string, context: AlbumContext) {
    this.assertTenantAccess(tenantId, context);
    const albums = await this.albums.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      where: { tenantId },
    });
    return Promise.all(albums.map((album) => this.toAlbumDto(album)));
  }

  async create(tenantId: string, input: CreateAlbumDto, context: AlbumContext) {
    this.assertTenantAccess(tenantId, context);
    const count = await this.albums.count({ where: { tenantId } });
    const id = randomUUID();
    const album = await this.albums.save(
      this.albums.create({
        allowDownload: Boolean(input.allowDownload),
        description: cleanNullable(input.description) ?? null,
        id,
        layoutType: 'grid',
        slug: await this.createUniqueSlug(tenantId, input.title, id),
        sortOrder: count,
        tenantId,
        title: input.title.trim(),
        visibility: input.visibility ?? ALBUM_VISIBILITY.PRIVATE,
      }),
    );
    await this.audit(context, tenantId, 'album.created', album.id);
    return this.toAlbumDto(album);
  }

  async update(tenantId: string, albumId: string, input: UpdateAlbumDto, context: AlbumContext) {
    this.assertTenantAccess(tenantId, context);
    const album = await this.findOwnedAlbum(tenantId, albumId);
    if (input.title !== undefined) album.title = input.title.trim();
    if (input.description !== undefined)
      album.description = cleanNullable(input.description) ?? null;
    if (input.visibility !== undefined) {
      await this.audit(context, tenantId, 'album.privacy_updated', albumId, {
        from: album.visibility,
        to: input.visibility,
      });
      album.visibility = input.visibility;
    }
    if (input.allowDownload !== undefined) album.allowDownload = input.allowDownload;

    const saved = await this.albums.save(album);
    await this.audit(context, tenantId, 'album.updated', albumId, { fields: Object.keys(input) });
    return this.toAlbumDto(saved);
  }

  async delete(tenantId: string, albumId: string, context: AlbumContext) {
    this.assertTenantAccess(tenantId, context);
    const album = await this.findOwnedAlbum(tenantId, albumId);
    await this.albums.softRemove(album);
    await this.audit(context, tenantId, 'album.deleted', albumId);
    return { deleted: true };
  }

  async reorder(tenantId: string, albumIds: string[], context: AlbumContext) {
    this.assertTenantAccess(tenantId, context);
    const albums = await this.albums.find({ where: { id: In(albumIds), tenantId } });
    if (albums.length !== albumIds.length) {
      throw new BadRequestException('Album order contains unknown albums');
    }

    await Promise.all(
      albumIds.map((id, sortOrder) => this.albums.update({ id, tenantId }, { sortOrder })),
    );
    await this.audit(context, tenantId, 'album.reordered', undefined, { albumIds });
    return this.list(tenantId, context);
  }

  async setCover(
    tenantId: string,
    albumId: string,
    mediaId: string | null | undefined,
    context: AlbumContext,
  ) {
    this.assertTenantAccess(tenantId, context);
    const album = await this.findOwnedAlbum(tenantId, albumId);
    if (mediaId) {
      const media = await this.media.findOne({ where: { albumId, id: mediaId, tenantId } });
      if (!media || media.type !== MEDIA_TYPE.IMAGE) {
        throw new BadRequestException('Cover must be an image from this album');
      }
    }
    album.coverMediaId = mediaId ?? null;
    const saved = await this.albums.save(album);
    await this.audit(context, tenantId, 'album.cover_updated', albumId, { mediaId });
    return this.toAlbumDto(saved);
  }

  private async findOwnedAlbum(tenantId: string, albumId: string) {
    const album = await this.albums.findOne({ where: { id: albumId, tenantId } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  private async createUniqueSlug(tenantId: string, title: string, albumId: string) {
    const base = slugify(title);
    const shortId = albumId.slice(0, 8);
    const preferred = `${base}-${shortId}`;
    const existing = await this.albums.findOne({
      where: { slug: preferred, tenantId },
      withDeleted: true,
    });
    return existing ? `${base}-${shortId}-${Date.now().toString(36)}` : preferred;
  }

  private async toAlbumDto(album: AlbumOrmEntity) {
    const mediaCount = await this.media.count({
      where: { albumId: album.id, tenantId: album.tenantId },
    });
    const cover = album.coverMediaId
      ? await this.media.findOne({ where: { id: album.coverMediaId, tenantId: album.tenantId } })
      : null;
    return {
      ...album,
      allowDownload: Boolean(album.allowDownload),
      coverUrl: cover?.publicUrl ?? null,
      mediaCount,
    };
  }

  private assertTenantAccess(tenantId: string, context: AlbumContext) {
    if (!context.tenantIds.includes(tenantId)) {
      throw new ForbiddenException('Tenant access denied');
    }
  }

  private audit(
    context: AlbumContext,
    tenantId: string,
    action: string,
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
      tenantId,
      userAgent: context.userAgent,
    });
  }
}

function cleanNullable(value: string | null | undefined) {
  if (value === undefined) return undefined;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function slugify(value: string) {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
  return slug || 'album';
}
