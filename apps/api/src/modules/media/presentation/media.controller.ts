import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { STORAGE_SERVICE, type StorageService } from '../../storage/domain/storage.service';
import { MediaService, type MemoryUpload } from '../application/media.service';
import {
  BatchDeleteMediaDto,
  MoveMediaDto,
  ReorderMediaDto,
  UpdateMediaDto,
  UploadMediaDto,
} from './media.dto';

@Controller()
export class MediaController {
  constructor(
    private readonly media: MediaService,
    @Inject(STORAGE_SERVICE)
    private readonly storage: StorageService,
  ) {}

  @Get('tenants/:tenantId/albums/:albumId/media')
  list(
    @Param('tenantId') tenantId: string,
    @Param('albumId') albumId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.list(tenantId, albumId, createContext(user, request));
  }

  @Post('tenants/:tenantId/media/upload')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: getUploadCeilingBytes() } }))
  upload(
    @Param('tenantId') tenantId: string,
    @Body() body: UploadMediaDto,
    @UploadedFile() file: MemoryUpload | undefined,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.upload(tenantId, body.albumId, file, createContext(user, request));
  }

  @Post('tenants/:tenantId/media/bulk-upload')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @UseInterceptors(FilesInterceptor('files', 25, { limits: { fileSize: getUploadCeilingBytes() } }))
  bulkUpload(
    @Param('tenantId') tenantId: string,
    @Body() body: UploadMediaDto,
    @UploadedFiles() files: MemoryUpload[] | undefined,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.bulkUpload(tenantId, body.albumId, files, createContext(user, request));
  }

  @Patch('tenants/:tenantId/media/reorder/:albumId')
  reorder(
    @Param('tenantId') tenantId: string,
    @Param('albumId') albumId: string,
    @Body() body: ReorderMediaDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.reorder(tenantId, albumId, body.mediaIds, createContext(user, request));
  }

  @Patch('tenants/:tenantId/media/:mediaId')
  update(
    @Param('tenantId') tenantId: string,
    @Param('mediaId') mediaId: string,
    @Body() body: UpdateMediaDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.update(tenantId, mediaId, body, createContext(user, request));
  }

  @Patch('tenants/:tenantId/media/:mediaId/move')
  move(
    @Param('tenantId') tenantId: string,
    @Param('mediaId') mediaId: string,
    @Body() body: MoveMediaDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.move(tenantId, mediaId, body.albumId, createContext(user, request));
  }

  @Post('tenants/:tenantId/media/:mediaId/retry-processing')
  retryProcessing(
    @Param('tenantId') tenantId: string,
    @Param('mediaId') mediaId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.retryProcessing(tenantId, mediaId, createContext(user, request));
  }

  @Delete('tenants/:tenantId/media')
  batchDelete(
    @Param('tenantId') tenantId: string,
    @Body() body: BatchDeleteMediaDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.media.batchDelete(tenantId, body.mediaIds, createContext(user, request));
  }

  @Get('tenants/:tenantId/media/:mediaId/download')
  async download(
    @Param('tenantId') tenantId: string,
    @Param('mediaId') mediaId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const file = await this.media.getDownload(tenantId, mediaId, createContext(user, request));
    setMediaResponseHeaders(response, file.mimeType, 'private, max-age=0');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName.replace(/"/g, '')}"`,
    );
    return response.send(await this.storage.read(file.storageKey));
  }

  @Get('tenants/:tenantId/media/:mediaId/file')
  async file(
    @Param('tenantId') tenantId: string,
    @Param('mediaId') mediaId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const file = await this.media.getFile(tenantId, mediaId, createContext(user, request));
    setMediaResponseHeaders(response, file.mimeType, 'private, max-age=0');
    return response.send(await this.storage.read(file.storageKey));
  }

  @Public()
  @Get('public/sites/:slug/gallery')
  publicGallery(@Param('slug') slug: string) {
    return this.media.listPublicBySite(slug);
  }

  @Public()
  @Get('public/tenants/:tenantId/media/:mediaId/download')
  async publicDownload(
    @Param('tenantId') tenantId: string,
    @Param('mediaId') mediaId: string,
    @Res() response: Response,
  ) {
    const file = await this.media.getDownload(tenantId, mediaId);
    setMediaResponseHeaders(response, file.mimeType, 'private, max-age=0');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName.replace(/"/g, '')}"`,
    );
    return response.send(await this.storage.read(file.storageKey));
  }

  @Public()
  @Get('public/tenants/:tenantId/media/:mediaId/file')
  async publicFile(
    @Param('tenantId') tenantId: string,
    @Param('mediaId') mediaId: string,
    @Res() response: Response,
  ) {
    const file = await this.media.getFile(tenantId, mediaId);
    setMediaResponseHeaders(response, file.mimeType, 'public, max-age=300');
    return response.send(await this.storage.read(file.storageKey));
  }
}

function createContext(user: AuthenticatedUser, request: Request) {
  return {
    actorUserId: user.id,
    ipAddress: request.ip,
    tenantIds: user.tenantIds,
    userAgent: request.headers['user-agent'],
  };
}

function getUploadCeilingBytes() {
  return 150 * 1024 * 1024;
}

function setMediaResponseHeaders(response: Response, contentType: string, cacheControl: string) {
  response.setHeader('Content-Type', contentType);
  response.setHeader('Cache-Control', cacheControl);
  response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
}
