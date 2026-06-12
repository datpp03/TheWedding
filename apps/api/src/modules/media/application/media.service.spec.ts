import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TENANT_VISIBILITY } from '@the-wedding/shared';
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

    return new MediaService(
      (overrides.media ?? media) as never,
      (overrides.mediaVersions ?? mediaVersions) as never,
      (overrides.albums ?? albums) as never,
      (overrides.tenants ?? tenants) as never,
      (overrides.storage ?? storage) as never,
      (overrides.auditLogs ?? auditLogs) as never,
    );
  }

  it('rejects unsupported uploads before writing storage', async () => {
    const storage = { upload: jest.fn() };
    const service = createService({ storage });
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

  it('denies public downloads when album downloads are disabled', async () => {
    const service = createService();

    await expect(service.getDownload('tenant-1', 'media-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('denies cross-tenant media listing', async () => {
    const service = createService();

    await expect(
      service.list('tenant-2', 'album-1', { actorUserId: 'user-1', tenantIds: ['tenant-1'] }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
