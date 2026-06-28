import { MEDIA_PROCESSING_STATUS, MEDIA_TYPE } from '@the-wedding/shared';
import sharp from 'sharp';
import { MediaProcessingProcessor } from './media-processing.processor';

describe('MediaProcessingProcessor', () => {
  it('creates image versions idempotently and marks media ready', async () => {
    const original = await createNoisyJpeg();
    const media = {
      id: 'media-1',
      mimeType: 'image/jpeg',
      processingStatus: MEDIA_PROCESSING_STATUS.PENDING,
      storageKey: 'tenants/tenant-1/media/media-1/original/original.jpg',
      tenantId: 'tenant-1',
      type: MEDIA_TYPE.IMAGE,
    };
    const mediaRepo = {
      findOne: jest.fn().mockResolvedValue(media),
      query: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const versionRepo = {
      upsert: jest.fn().mockResolvedValue(undefined),
    };
    const storage = {
      put: jest.fn((buffer: Buffer, options: { contentType: string; key: string }) =>
        Promise.resolve({
          contentType: options.contentType,
          key: options.key,
          size: buffer.byteLength,
          url: `/api/v1/storage/local/${encodeURIComponent(options.key)}`,
        }),
      ),
      read: jest.fn().mockResolvedValue(original),
    };
    const processor = new MediaProcessingProcessor(
      mediaRepo as never,
      versionRepo as never,
      storage as never,
    );

    await processor.process({
      mediaId: media.id,
      mimeType: media.mimeType,
      storageKey: media.storageKey,
      tenantId: media.tenantId,
      type: media.type,
    });

    expect(versionRepo.upsert).toHaveBeenCalledTimes(3);
    expect(versionRepo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ versionType: 'thumbnail' }),
      ['mediaId', 'versionType'],
    );
    expect(mediaRepo.update).toHaveBeenCalledWith(
      media.id,
      expect.objectContaining({ processingStatus: MEDIA_PROCESSING_STATUS.READY }),
    );
    expect(mediaRepo.update).toHaveBeenCalledWith(
      media.id,
      expect.objectContaining({ blurHash: null }),
    );
    expect(mediaRepo.query).toHaveBeenCalled();
  });
});

async function createNoisyJpeg() {
  const width = 64;
  const height = 1024;
  const data = Buffer.alloc(width * height * 3);
  let seed = 123456789;
  for (let index = 0; index < data.length; index += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    data[index] = seed & 0xff;
  }
  return sharp(data, { raw: { channels: 3, height, width } })
    .jpeg({ quality: 95 })
    .toBuffer();
}
