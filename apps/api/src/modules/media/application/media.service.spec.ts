import {
  BadRequestException,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MEDIA_PROCESSING_STATUS, TENANT_VISIBILITY } from '@the-wedding/shared';
import { MediaService, type MemoryUpload } from './media.service';

describe('MediaService', () => {
  const baseContext = {
    actorUserId: 'user-1',
    tenantIds: ['tenant-1'],
  };

  function createService(overrides: Partial<Record<string, unknown>> = {}) {
    const albums = {
      count: jest.fn().mockResolvedValue(0),
      findOne: jest.fn().mockResolvedValue({
        allowDownload: false,
        id: 'album-1',
        tenantId: 'tenant-1',
        visibility: TENANT_VISIBILITY.PRIVATE,
      }),
    };
    const media = {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn((input: Record<string, unknown>) => ({ ...input })),
      createQueryBuilder: jest.fn().mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({ usedBytes: '0' }),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      }),
      findOne: jest.fn().mockResolvedValue({
        albumId: 'album-1',
        id: 'media-1',
        mimeType: 'image/jpeg',
        originalFileName: 'photo.jpg',
        storageKey: 'tenants/tenant-1/media/media-1/original/random.jpg',
        tenantId: 'tenant-1',
      }),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };
    const mediaVersions = {
      create: jest.fn((input: Record<string, unknown>) => ({ ...input })),
      save: jest.fn(),
    };
    const tenants = { findOne: jest.fn() };
    const storage = {
      delete: jest.fn(),
      getPublicUrl: jest.fn(),
      getSignedUrl: jest.fn(),
      upload: jest.fn().mockResolvedValue({
        contentType: 'image/jpeg',
        key: 'tenants/tenant-1/media/media-1/original/random.jpg',
        size: 128,
        url: '/api/v1/storage/local/key',
      }),
    };
    const auditLogs = { append: jest.fn() };
    const systemParameters = {
      assertDownloadEnabled: jest.fn().mockResolvedValue(undefined),
      assertPublicGalleryEnabled: jest.fn().mockResolvedValue(undefined),
      assertUploadEnabled: jest.fn().mockResolvedValue(undefined),
    };
    const mediaProcessing = {
      enqueue: jest.fn().mockResolvedValue(undefined),
      retry: jest.fn().mockResolvedValue(undefined),
    };
    const config = {
      get: jest.fn((_key: string, defaultValue?: number) => defaultValue ?? 1024 * 1024 * 1024),
    };

    const service = new MediaService(
      (overrides.media ?? media) as never,
      (overrides.mediaVersions ?? mediaVersions) as never,
      (overrides.albums ?? albums) as never,
      (overrides.tenants ?? tenants) as never,
      (overrides.storage ?? storage) as never,
      (overrides.auditLogs ?? auditLogs) as never,
      (overrides.systemParameters ?? systemParameters) as never,
      (overrides.mediaProcessing ?? mediaProcessing) as never,
      (overrides.config ?? config) as never,
    );
    return { media, mediaProcessing, service, storage };
  }

  it('rejects unsupported uploads before writing storage', async () => {
    const storage = { upload: jest.fn() };
    const { service } = createService({ storage });
    const file: MemoryUpload = {
      buffer: Buffer.from('bad'),
      mimetype: 'application/pdf',
      originalname: 'menu.pdf',
      size: 3,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('rejects suspicious MIME and extension mismatches before writing storage', async () => {
    const { service, storage } = createService();
    const file: MemoryUpload = {
      buffer: Buffer.from('jpg'),
      mimetype: 'image/jpeg',
      originalname: 'photo.png',
      size: 3,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('rejects empty uploads before writing storage', async () => {
    const { service, storage } = createService();
    const file: MemoryUpload = {
      buffer: Buffer.alloc(0),
      mimetype: 'image/jpeg',
      originalname: 'photo.jpg',
      size: 0,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('rejects uploads that exceed the tenant storage quota before writing storage', async () => {
    const media = {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn((input: Record<string, unknown>) => ({ ...input })),
      createQueryBuilder: jest.fn().mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({ usedBytes: '95' }),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      }),
      findOne: jest.fn().mockResolvedValue({
        allowDownload: false,
        albumId: 'album-1',
        id: 'media-1',
        mimeType: 'image/jpeg',
        originalFileName: 'photo.jpg',
        storageKey: 'tenants/tenant-1/media/media-1/original/random.jpg',
        tenantId: 'tenant-1',
        visibility: TENANT_VISIBILITY.PRIVATE,
      }),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };
    const config = { get: jest.fn().mockReturnValue(100) };
    const { service, storage } = createService({ config, media });
    const file: MemoryUpload = {
      buffer: Buffer.from('jpgjpg'),
      mimetype: 'image/jpeg',
      originalname: 'photo.jpg',
      size: 6,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('allows large phone photos within the configured image upload limit', async () => {
    const { service, storage } = createService();
    const file: MemoryUpload = {
      buffer: Buffer.from('jpg'),
      mimetype: 'image/jpeg',
      originalname: 'phone-photo.jpg',
      size: 16 * 1024 * 1024,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).resolves.toEqual(
      expect.objectContaining({
        mimeType: 'image/jpeg',
        processingStatus: MEDIA_PROCESSING_STATUS.PENDING,
      }),
    );
    expect(storage.upload).toHaveBeenCalled();
  });

  it('returns a service unavailable error when media storage cannot write the file', async () => {
    const storage = {
      delete: jest.fn(),
      getPublicUrl: jest.fn(),
      getSignedUrl: jest.fn(),
      upload: jest.fn().mockRejectedValue(new Error('disk is read-only')),
    };
    const { service } = createService({ storage });
    const file: MemoryUpload = {
      buffer: Buffer.from('jpg'),
      mimetype: 'image/jpeg',
      originalname: 'photo.jpg',
      size: 3,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('denies public downloads when album downloads are disabled', async () => {
    const { service } = createService();

    await expect(service.getDownload('tenant-1', 'media-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('denies cross-tenant media listing', async () => {
    const { service } = createService();

    await expect(
      service.list('tenant-2', 'album-1', { actorUserId: 'user-1', tenantIds: ['tenant-1'] }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('blocks uploads when the runtime parameter disables them', async () => {
    const systemParameters = {
      assertDownloadEnabled: jest.fn().mockResolvedValue(undefined),
      assertPublicGalleryEnabled: jest.fn().mockResolvedValue(undefined),
      assertUploadEnabled: jest
        .fn()
        .mockRejectedValue(new ServiceUnavailableException('Uploads disabled')),
    };
    const { service } = createService({ systemParameters });
    const file: MemoryUpload = {
      buffer: Buffer.from('jpg'),
      mimetype: 'image/jpeg',
      originalname: 'photo.jpg',
      size: 3,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('queues uploaded images for processing before returning the media row', async () => {
    const { mediaProcessing, service } = createService();
    const file: MemoryUpload = {
      buffer: Buffer.from('jpg'),
      mimetype: 'image/jpeg',
      originalname: 'photo.jpg',
      size: 3,
    };

    const uploaded = await service.upload('tenant-1', 'album-1', file, baseContext);

    expect(uploaded.processingStatus).toBe(MEDIA_PROCESSING_STATUS.PENDING);
    expect(mediaProcessing.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        mediaId: uploaded.id,
        mimeType: 'image/jpeg',
        tenantId: 'tenant-1',
      }),
    );
  });

  it('accepts uploads when media processing enqueue fails', async () => {
    const mediaProcessing = {
      enqueue: jest.fn().mockRejectedValue(new Error('redis unavailable')),
      retry: jest.fn().mockResolvedValue(undefined),
    };
    const { service, storage } = createService({ mediaProcessing });
    const file: MemoryUpload = {
      buffer: Buffer.from('jpg'),
      mimetype: 'image/jpeg',
      originalname: 'photo.jpg',
      size: 3,
    };

    await expect(service.upload('tenant-1', 'album-1', file, baseContext)).resolves.toEqual(
      expect.objectContaining({
        mimeType: 'image/jpeg',
        processingStatus: MEDIA_PROCESSING_STATUS.PENDING,
      }),
    );
    expect(storage.upload).toHaveBeenCalled();
    expect(mediaProcessing.enqueue).toHaveBeenCalled();
  });
});
