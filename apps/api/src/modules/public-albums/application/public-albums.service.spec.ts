import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ALBUM_VISIBILITY, TENANT_STATUS, TENANT_VISIBILITY } from '@the-wedding/shared';
import { PublicAlbumsService } from './public-albums.service';

describe(PublicAlbumsService.name, () => {
  const publicAlbum = {
    allowDownload: false,
    coverMediaId: null,
    createdAt: new Date(),
    description: 'Public memories',
    id: 'album-1',
    tenantId: 'tenant-1',
    title: 'Ceremony',
    visibility: ALBUM_VISIBILITY.PUBLIC,
  };
  const tenant = {
    id: 'tenant-1',
    siteName: 'Wedding',
    slug: 'wedding',
    status: TENANT_STATUS.ACTIVE,
    visibility: TENANT_VISIBILITY.PUBLIC,
  };
  const context = {
    actorUserId: 'user-1',
    email: 'user@example.com',
    tenantIds: ['tenant-1'],
  };

  function createService(overrides: Record<string, unknown> = {}) {
    const albums = {
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([publicAlbum]),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      }),
      find: jest.fn().mockResolvedValue([publicAlbum]),
      findOne: jest.fn().mockResolvedValue(publicAlbum),
    };
    const media = {
      count: jest.fn().mockResolvedValue(2),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    };
    const tenants = {
      findOne: jest.fn().mockResolvedValue(tenant),
    };
    const users = {
      findOne: jest.fn().mockResolvedValue({ displayName: 'User' }),
    };
    const featuredEntries = {
      find: jest.fn().mockResolvedValue([]),
    };
    const wishes = {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn((input: Record<string, unknown>) => ({ ...input, id: 'wish-1' })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn((input) => Promise.resolve(input)),
    };
    const reactions = {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn((input: Record<string, unknown>) => ({ ...input, id: 'reaction-1' })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn((input) => Promise.resolve(input)),
    };
    const reactionSymbols = {
      delete: jest.fn().mockResolvedValue(undefined),
      find: jest.fn().mockResolvedValue([]),
      save: jest.fn((input) => Promise.resolve(input)),
    };
    const searchMetadata = {};
    const auditLogs = {
      append: jest.fn().mockResolvedValue(undefined),
    };

    const service = new PublicAlbumsService(
      (overrides.albums ?? albums) as never,
      (overrides.media ?? media) as never,
      (overrides.tenants ?? tenants) as never,
      (overrides.users ?? users) as never,
      (overrides.featuredEntries ?? featuredEntries) as never,
      (overrides.wishes ?? wishes) as never,
      (overrides.reactions ?? reactions) as never,
      (overrides.reactionSymbols ?? reactionSymbols) as never,
      (overrides.searchMetadata ?? searchMetadata) as never,
      (overrides.auditLogs ?? auditLogs) as never,
    );
    return { albums, auditLogs, reactions, reactionSymbols, service, wishes };
  }

  it('returns public featured albums through the public visibility query', async () => {
    const { albums, service } = createService();

    await service.featured('today');

    expect(albums.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { visibility: ALBUM_VISIBILITY.PUBLIC },
      }),
    );
  });

  it('allows unlisted albums by direct link but hides private albums', async () => {
    const unlistedAlbum = { ...publicAlbum, visibility: ALBUM_VISIBILITY.UNLISTED };
    const { service } = createService({
      albums: {
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(unlistedAlbum),
      },
    });

    await expect(service.getPublicAlbum('album-1')).resolves.toMatchObject({
      id: 'album-1',
      visibility: ALBUM_VISIBILITY.UNLISTED,
    });

    const privateService = createService({
      albums: {
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue({
          ...publicAlbum,
          visibility: ALBUM_VISIBILITY.PRIVATE,
        }),
      },
    }).service;
    await expect(privateService.getPublicAlbum('album-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects duplicate wishes from the same user', async () => {
    const { service } = createService({
      wishes: {
        count: jest.fn().mockResolvedValue(1),
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue({ id: 'wish-existing' }),
      },
    });

    await expect(
      service.createWish('album-1', { message: 'Congratulations' }, context),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects reactions that are not in the album symbol set', async () => {
    const { service } = createService({
      reactionSymbols: {
        find: jest.fn().mockResolvedValue([{ glyph: 'star', symbolKey: 'star' }]),
      },
    });

    await expect(
      service.createReaction('album-1', { symbolKey: 'script' }, context),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
