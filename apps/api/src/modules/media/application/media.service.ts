import { randomUUID } from 'node:crypto';
import path from 'node:path';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MEDIA_PROCESSING_STATUS, MEDIA_TYPE, TENANT_VISIBILITY } from '@the-wedding/shared';
import { In, Repository } from 'typeorm';
import { AlbumOrmEntity } from '../../albums/infrastructure/album.orm-entity';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import { SystemParametersService } from '../../settings/application/system-parameters.service';
import { STORAGE_SERVICE, type StorageService } from '../../storage/domain/storage.service';
import { TenantOrmEntity } from '../../tenants/infrastructure/tenant.orm-entity';
import {
  MEDIA_PROCESSING_SERVICE,
  type MediaProcessingService,
} from '../domain/media-processing-service';
import { MediaOrmEntity } from '../infrastructure/media.orm-entity';
import { MediaVersionOrmEntity } from '../infrastructure/media-version.orm-entity';
import type { UpdateMediaDto } from '../presentation/media.dto';

export type MediaContext = {
  actorUserId: string;
  tenantIds: string[];
  ipAddress?: string;
  userAgent?: string;
};

export type MemoryUpload = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 150 * 1024 * 1024;
const ALLOWED_TYPES = new Map<string, { extension: string; type: string; maxBytes: number }>([
  ['image/jpeg', { extension: 'jpg', maxBytes: MAX_IMAGE_BYTES, type: MEDIA_TYPE.IMAGE }],
  ['image/png', { extension: 'png', maxBytes: MAX_IMAGE_BYTES, type: MEDIA_TYPE.IMAGE }],
  ['image/webp', { extension: 'webp', maxBytes: MAX_IMAGE_BYTES, type: MEDIA_TYPE.IMAGE }],
  ['video/mp4', { extension: 'mp4', maxBytes: MAX_VIDEO_BYTES, type: MEDIA_TYPE.VIDEO }],
  ['video/webm', { extension: 'webm', maxBytes: MAX_VIDEO_BYTES, type: MEDIA_TYPE.VIDEO }],
  ['video/quicktime', { extension: 'mov', maxBytes: MAX_VIDEO_BYTES, type: MEDIA_TYPE.VIDEO }],
]);

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaOrmEntity)
    private readonly media: Repository<MediaOrmEntity>,
    @InjectRepository(MediaVersionOrmEntity)
    private readonly mediaVersions: Repository<MediaVersionOrmEntity>,
    @InjectRepository(AlbumOrmEntity)
    private readonly albums: Repository<AlbumOrmEntity>,
    @InjectRepository(TenantOrmEntity)
    private readonly tenants: Repository<TenantOrmEntity>,
    @Inject(STORAGE_SERVICE)
    private readonly storage: StorageService,
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogs: AuditLogRepository,
    private readonly systemParameters: SystemParametersService,
    @Inject(MEDIA_PROCESSING_SERVICE)
    private readonly mediaProcessing: MediaProcessingService,
    private readonly config: ConfigService,
  ) {}

  async list(tenantId: string, albumId: string, context: MediaContext) {
    this.assertTenantAccess(tenantId, context);
    await this.findOwnedAlbum(tenantId, albumId);
    const rows = await this.media.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      where: { albumId, tenantId },
    });
    return rows.map((row) => toMediaDto(row));
  }

  async upload(
    tenantId: string,
    albumId: string,
    file: MemoryUpload | undefined,
    context: MediaContext,
  ) {
    await this.systemParameters.assertUploadEnabled();
    this.assertTenantAccess(tenantId, context);
    await this.findOwnedAlbum(tenantId, albumId);
    const validated = validateUpload(file);
    await this.assertTenantQuota(tenantId, validated.file.size);
    const mediaId = randomUUID();
    const sortOrder = await this.media.count({ where: { albumId, tenantId } });
    const uploaded = await this.storage.upload(validated.file.buffer, {
      contentType: validated.file.mimetype,
      extension: validated.extension,
      mediaId,
      tenantId,
      visibility: 'private',
    });
    const media = await this.media.save(
      this.media.create({
        albumId,
        id: mediaId,
        mimeType: validated.file.mimetype,
        originalFileName: sanitizeDisplayName(validated.file.originalname),
        processingAttempts: 0,
        processingFailureReason: null,
        processingStatus: MEDIA_PROCESSING_STATUS.PENDING,
        publicUrl: null,
        sizeBytes: String(uploaded.size),
        sortOrder,
        storageKey: uploaded.key,
        storageProvider: 'local',
        storedFileName: path.posix.basename(uploaded.key),
        tenantId,
        type: validated.type,
      }),
    );
    await this.mediaVersions.save(
      this.mediaVersions.create({
        mediaId,
        metadataJson: JSON.stringify({
          sizeBytes: uploaded.size,
          usageBillable: true,
        }),
        storageKey: uploaded.key,
        url: null,
        versionType: 'original',
      }),
    );
    await this.audit(context, tenantId, 'media.uploaded', media.id, {
      albumId,
      mimeType: media.mimeType,
    });
    await this.mediaProcessing.enqueue({
      mediaId,
      mimeType: media.mimeType,
      storageKey: media.storageKey,
      tenantId,
      type: media.type,
    });
    return toMediaDto(media);
  }

  async bulkUpload(
    tenantId: string,
    albumId: string,
    files: MemoryUpload[] | undefined,
    context: MediaContext,
  ) {
    if (!files?.length) {
      throw new BadRequestException('At least one file is required');
    }
    const uploaded = [];
    for (const file of files) {
      uploaded.push(await this.upload(tenantId, albumId, file, context));
    }
    return uploaded;
  }

  async update(tenantId: string, mediaId: string, input: UpdateMediaDto, context: MediaContext) {
    this.assertTenantAccess(tenantId, context);
    const media = await this.findOwnedMedia(tenantId, mediaId);
    if (input.title !== undefined) media.title = cleanNullable(input.title) ?? null;
    if (input.description !== undefined)
      media.description = cleanNullable(input.description) ?? null;
    if (input.takenAt !== undefined) media.takenAt = input.takenAt ? new Date(input.takenAt) : null;
    const saved = await this.media.save(media);
    await this.audit(context, tenantId, 'media.metadata_updated', mediaId, {
      fields: Object.keys(input),
    });
    return toMediaDto(saved);
  }

  async reorder(tenantId: string, albumId: string, mediaIds: string[], context: MediaContext) {
    this.assertTenantAccess(tenantId, context);
    await this.findOwnedAlbum(tenantId, albumId);
    const rows = await this.media.find({ where: { albumId, id: In(mediaIds), tenantId } });
    if (rows.length !== mediaIds.length) {
      throw new BadRequestException('Media order contains unknown items');
    }
    await Promise.all(
      mediaIds.map((id, sortOrder) => this.media.update({ id, tenantId }, { sortOrder })),
    );
    await this.audit(context, tenantId, 'media.reordered', undefined, { albumId, mediaIds });
    return this.list(tenantId, albumId, context);
  }

  async move(tenantId: string, mediaId: string, targetAlbumId: string, context: MediaContext) {
    this.assertTenantAccess(tenantId, context);
    const media = await this.findOwnedMedia(tenantId, mediaId);
    await this.findOwnedAlbum(tenantId, targetAlbumId);
    media.albumId = targetAlbumId;
    media.sortOrder = await this.media.count({ where: { albumId: targetAlbumId, tenantId } });
    const saved = await this.media.save(media);
    await this.audit(context, tenantId, 'media.moved', mediaId, { targetAlbumId });
    return toMediaDto(saved);
  }

  async batchDelete(tenantId: string, mediaIds: string[], context: MediaContext) {
    this.assertTenantAccess(tenantId, context);
    const rows = await this.media.find({ where: { id: In(mediaIds), tenantId } });
    if (rows.length !== mediaIds.length) {
      throw new BadRequestException('Delete request contains unknown media');
    }
    await Promise.all(rows.map((row) => this.storage.delete(row.storageKey)));
    await this.media.softRemove(rows);
    await this.audit(context, tenantId, 'media.deleted', undefined, { mediaIds });
    return { deleted: rows.length };
  }

  async getDownload(tenantId: string, mediaId: string, context?: MediaContext) {
    await this.systemParameters.assertDownloadEnabled();
    const media = await this.findMediaWithAlbum(tenantId, mediaId);
    if (context) {
      this.assertTenantAccess(tenantId, context);
    } else if (!this.canPublicDownload(media.album)) {
      throw new ForbiddenException('Download is not allowed');
    }

    if (!media.album.allowDownload && !context) {
      throw new ForbiddenException('Download is not allowed');
    }

    if (context) {
      await this.audit(context, tenantId, 'media.downloaded', media.id, { albumId: media.albumId });
    }

    return {
      fileName: media.originalFileName,
      mimeType: media.mimeType,
      storageKey: media.storageKey,
    };
  }

  async getFile(tenantId: string, mediaId: string, context?: MediaContext) {
    const media = await this.findMediaWithAlbum(tenantId, mediaId);
    if (context) {
      this.assertTenantAccess(tenantId, context);
    } else if (media.album.visibility !== TENANT_VISIBILITY.PUBLIC) {
      throw new ForbiddenException('Media is private');
    }
    const displayVersion = await this.mediaVersions.findOne({
      where: { mediaId, versionType: 'gallery' },
    });
    if (!context && !displayVersion) {
      throw new ForbiddenException('Media is not ready for public display');
    }

    return {
      fileName: media.originalFileName,
      mimeType: displayVersion?.versionType === 'gallery' ? 'image/webp' : media.mimeType,
      storageKey: displayVersion?.storageKey ?? media.storageKey,
    };
  }

  async retryProcessing(tenantId: string, mediaId: string, context: MediaContext) {
    this.assertTenantAccess(tenantId, context);
    const media = await this.findOwnedMedia(tenantId, mediaId);
    await this.mediaProcessing.retry(media.id);
    await this.audit(context, tenantId, 'media.processing_retried', media.id, {
      previousStatus: media.processingStatus,
    });
    return toMediaDto({
      ...media,
      processingFailureReason: null,
      processingStatus: MEDIA_PROCESSING_STATUS.PENDING,
    });
  }

  async listPublicBySite(slug: string) {
    await this.systemParameters.assertPublicGalleryEnabled();
    const tenant = await this.tenants.findOne({
      where: { slug, visibility: TENANT_VISIBILITY.PUBLIC },
    });
    if (!tenant) {
      throw new NotFoundException('Public gallery not found');
    }
    const albums = await this.albums.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      where: { tenantId: tenant.id, visibility: TENANT_VISIBILITY.PUBLIC },
    });
    const albumDtos = [];
    for (const album of albums) {
      const media = await this.media.find({
        order: { sortOrder: 'ASC', createdAt: 'ASC' },
        where: { albumId: album.id, tenantId: tenant.id },
      });
      albumDtos.push({
        ...album,
        allowDownload: Boolean(album.allowDownload),
        coverUrl: resolvePublicCoverUrl(media, album.coverMediaId),
        media: media.map((item) => toMediaDto(item, true)),
        mediaCount: media.length,
      });
    }
    return { albums: albumDtos, tenantId: tenant.id };
  }

  private async findOwnedAlbum(tenantId: string, albumId: string) {
    const album = await this.albums.findOne({ where: { id: albumId, tenantId } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  private async findOwnedMedia(tenantId: string, mediaId: string) {
    const media = await this.media.findOne({ where: { id: mediaId, tenantId } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }

  private async findMediaWithAlbum(tenantId: string, mediaId: string) {
    const media = await this.findOwnedMedia(tenantId, mediaId);
    const album = await this.findOwnedAlbum(tenantId, media.albumId);
    return { ...media, album };
  }

  private canPublicDownload(album: AlbumOrmEntity) {
    return album.visibility === TENANT_VISIBILITY.PUBLIC && Boolean(album.allowDownload);
  }

  private assertTenantAccess(tenantId: string, context: MediaContext) {
    if (!context.tenantIds.includes(tenantId)) {
      throw new ForbiddenException('Tenant access denied');
    }
  }

  private async assertTenantQuota(tenantId: string, incomingBytes: number) {
    const quotaBytes = this.config.get<number>('TENANT_STORAGE_QUOTA_BYTES', 1024 * 1024 * 1024);
    const used = await this.media
      .createQueryBuilder('media')
      .select('COALESCE(SUM(media.sizeBytes::bigint), 0)', 'usedBytes')
      .where('media.tenantId = :tenantId', { tenantId })
      .getRawOne<{ usedBytes: string | number | null }>();
    const usedBytes = Number(used?.usedBytes ?? 0);

    if (usedBytes + incomingBytes > quotaBytes) {
      throw new ForbiddenException('Tenant storage quota exceeded');
    }
  }

  private audit(
    context: MediaContext,
    tenantId: string,
    action: string,
    entityId?: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.auditLogs.append({
      action,
      actorUserId: context.actorUserId,
      entityId,
      entityType: 'media',
      ipAddress: context.ipAddress,
      metadata,
      tenantId,
      userAgent: context.userAgent,
    });
  }
}

function validateUpload(file: MemoryUpload | undefined) {
  if (!file) {
    throw new BadRequestException('File is required');
  }
  const allowed = ALLOWED_TYPES.get(file.mimetype);
  if (!allowed) {
    throw new BadRequestException('Unsupported file type');
  }
  const extension = path.extname(file.originalname).replace('.', '').toLowerCase();
  if (extension !== allowed.extension && !(allowed.extension === 'jpg' && extension === 'jpeg')) {
    throw new BadRequestException('File extension does not match MIME type');
  }
  if (file.size > allowed.maxBytes) {
    throw new BadRequestException('File exceeds upload size limit');
  }
  return { extension: allowed.extension, file, type: allowed.type };
}

function sanitizeDisplayName(value: string) {
  return (
    path
      .basename(value)
      .replace(/[^\w.\- ()]/g, '_')
      .slice(0, 500) || 'upload'
  );
}

function cleanNullable(value: string | null | undefined) {
  if (value === undefined) return undefined;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toMediaDto(media: MediaOrmEntity, isPublic = false) {
  const optimizedUrl = media.optimizedUrl ?? null;
  const ownerDisplayUrl =
    optimizedUrl ?? `/api/v1/tenants/${media.tenantId}/media/${media.id}/file`;
  return {
    albumId: media.albumId,
    createdAt: media.createdAt,
    description: media.description,
    durationSeconds: media.durationSeconds,
    height: media.height,
    id: media.id,
    mimeType: media.mimeType,
    optimizedUrl,
    originalFileName: media.originalFileName,
    processingAttempts: media.processingAttempts,
    processingFailureReason: media.processingFailureReason,
    processingStatus: media.processingStatus,
    publicUrl: isPublic ? optimizedUrl : ownerDisplayUrl,
    sizeBytes: Number(media.sizeBytes),
    sortOrder: media.sortOrder,
    takenAt: media.takenAt,
    tenantId: media.tenantId,
    thumbnailUrl: media.thumbnailUrl,
    title: media.title,
    type: media.type,
    updatedAt: media.updatedAt,
    width: media.width,
  };
}

function resolvePublicCoverUrl(media: MediaOrmEntity[], coverMediaId: string | null) {
  const selected = coverMediaId
    ? media.find((item) => item.id === coverMediaId)
    : media.find((item) => item.optimizedUrl);
  return selected?.optimizedUrl ?? null;
}
