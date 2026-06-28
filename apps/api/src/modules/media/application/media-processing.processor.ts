import path from 'node:path';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MEDIA_PROCESSING_STATUS, MEDIA_TYPE, MEDIA_VERSION_TYPE } from '@the-wedding/shared';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { STORAGE_SERVICE, type StorageService } from '../../storage/domain/storage.service';
import { MediaVersionOrmEntity } from '../infrastructure/media-version.orm-entity';
import { MediaOrmEntity } from '../infrastructure/media.orm-entity';
import type { MediaProcessingJob } from '../domain/media-processing-service';

type ImageProfile = {
  height?: number;
  label: string;
  quality: number;
  type: string;
  width: number;
};

const IMAGE_PROFILES: ImageProfile[] = [
  { height: 360, label: 'thumb_360', quality: 76, type: MEDIA_VERSION_TYPE.THUMBNAIL, width: 360 },
  {
    height: 1280,
    label: 'gallery_1280',
    quality: 82,
    type: MEDIA_VERSION_TYPE.GALLERY,
    width: 1280,
  },
  {
    height: 2048,
    label: 'lightbox_2048',
    quality: 86,
    type: MEDIA_VERSION_TYPE.LIGHTBOX,
    width: 2048,
  },
];

const MAX_BLUR_HASH_LENGTH = 200;

@Injectable()
export class MediaProcessingProcessor {
  constructor(
    @InjectRepository(MediaOrmEntity)
    private readonly media: Repository<MediaOrmEntity>,
    @InjectRepository(MediaVersionOrmEntity)
    private readonly mediaVersions: Repository<MediaVersionOrmEntity>,
    @Inject(STORAGE_SERVICE)
    private readonly storage: StorageService,
  ) {}

  async process(job: MediaProcessingJob) {
    const media = await this.media.findOne({ where: { id: job.mediaId, tenantId: job.tenantId } });
    if (!media) return;
    if (media.processingStatus === MEDIA_PROCESSING_STATUS.READY && media.optimizedUrl) return;

    await this.media.update(media.id, {
      processingAttempts: () => '"processingAttempts" + 1',
      processingFailureReason: null,
      processingStatus: MEDIA_PROCESSING_STATUS.PROCESSING,
      updatedAt: new Date(),
    });

    try {
      if (media.type === MEDIA_TYPE.IMAGE) {
        await this.processImage(media);
      } else if (media.type === MEDIA_TYPE.VIDEO) {
        await this.processVideo(media);
      }

      await this.media.update(media.id, {
        processingFailureReason: null,
        processingStatus: MEDIA_PROCESSING_STATUS.READY,
        updatedAt: new Date(),
      });
      await this.recalculateTenantStorageUsage(media.tenantId);
    } catch (caught) {
      await this.media.update(media.id, {
        processingFailureReason: readFailure(caught),
        processingStatus: MEDIA_PROCESSING_STATUS.FAILED,
        updatedAt: new Date(),
      });
      throw caught;
    }
  }

  private async processImage(media: MediaOrmEntity) {
    const original = await this.storage.read(media.storageKey);
    const originalImage = sharp(original, { failOn: 'none' }).rotate();
    const metadata = await originalImage.metadata();
    const blurPlaceholder = await originalImage
      .clone()
      .resize({ fit: 'inside', width: 24, withoutEnlargement: true })
      .webp({ quality: 36 })
      .toBuffer();

    const updates: Partial<MediaOrmEntity> = {
      blurHash: createSafeBlurHash(blurPlaceholder),
      height: metadata.height ?? null,
      width: metadata.width ?? null,
    };

    for (const profile of IMAGE_PROFILES) {
      const buffer = await originalImage
        .clone()
        .resize({
          fit: 'inside',
          height: profile.height,
          width: profile.width,
          withoutEnlargement: true,
        })
        .webp({ effort: 4, quality: profile.quality })
        .toBuffer();
      const key = createVersionKey(media, `${profile.label}.webp`);
      const uploaded = await this.storage.put(buffer, {
        contentType: 'image/webp',
        extension: 'webp',
        key,
        mediaId: media.id,
        tenantId: media.tenantId,
        visibility: 'public',
      });
      await this.upsertVersion(media.id, profile.type, uploaded.key, uploaded.url, {
        profile: profile.label,
        sizeBytes: uploaded.size,
        usageBillable: true,
      });
      if (profile.type === MEDIA_VERSION_TYPE.THUMBNAIL) {
        updates.thumbnailUrl = uploaded.url;
      }
      if (profile.type === MEDIA_VERSION_TYPE.GALLERY) {
        updates.optimizedUrl = uploaded.url;
        updates.publicUrl = uploaded.url;
      }
    }

    await this.media.update(media.id, { ...updates, updatedAt: new Date() });
  }

  private async processVideo(media: MediaOrmEntity) {
    await this.upsertVersion(media.id, MEDIA_VERSION_TYPE.VIDEO_PREVIEW, media.storageKey, null, {
      note: 'Video preview frame extraction requires ffmpeg in the production worker image.',
      originalMimeType: media.mimeType,
      sizeBytes: 0,
      usageBillable: false,
    });
    await this.media.update(media.id, {
      metadataJson: JSON.stringify({
        ...(media.metadataJson ? JSON.parse(media.metadataJson) : {}),
        previewStatus: 'metadata_only',
      }),
      updatedAt: new Date(),
    });
  }

  private async upsertVersion(
    mediaId: string,
    versionType: string,
    storageKey: string,
    url: string | null,
    metadata: Record<string, unknown>,
  ) {
    await this.mediaVersions.upsert(
      {
        mediaId,
        metadataJson: JSON.stringify(metadata),
        storageKey,
        url,
        versionType,
      },
      ['mediaId', 'versionType'],
    );
  }

  private async recalculateTenantStorageUsage(tenantId: string) {
    await this.media.query(
      `
      INSERT INTO "storage_usage" ("tenantId", "usedBytes", "fileCount", "updatedAt")
      SELECT
        $1,
        COALESCE(originals."usedBytes", 0) + COALESCE(versions."usedBytes", 0),
        COALESCE(originals."fileCount", 0),
        now()
      FROM (
        SELECT COALESCE(SUM("sizeBytes"::bigint), 0) AS "usedBytes", COUNT(*) AS "fileCount"
        FROM "media"
        WHERE "tenantId" = $1 AND "deletedAt" IS NULL
      ) originals
      CROSS JOIN (
        SELECT COALESCE(SUM((mv."metadataJson"::jsonb ->> 'sizeBytes')::bigint), 0) AS "usedBytes"
        FROM "media_versions" mv
        INNER JOIN "media" m ON m."id" = mv."mediaId"
        WHERE m."tenantId" = $1
          AND m."deletedAt" IS NULL
          AND mv."versionType" <> 'original'
          AND mv."metadataJson" IS NOT NULL
      ) versions
      ON CONFLICT ("tenantId")
      DO UPDATE SET "usedBytes" = EXCLUDED."usedBytes", "fileCount" = EXCLUDED."fileCount", "updatedAt" = now();
      `,
      [tenantId],
    );
  }
}

function createVersionKey(media: MediaOrmEntity, fileName: string) {
  return path.posix.join('tenants', media.tenantId, 'media', media.id, 'versions', fileName);
}

function createSafeBlurHash(buffer: Buffer) {
  const value = `data:image/webp;base64,${buffer.toString('base64')}`;
  return value.length <= MAX_BLUR_HASH_LENGTH ? value : null;
}

function readFailure(caught: unknown) {
  return caught instanceof Error ? caught.message.slice(0, 2000) : 'Unknown processing failure';
}
