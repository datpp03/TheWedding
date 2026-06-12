import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { AlbumsService } from '../application/albums.service';
import { CreateAlbumDto, ReorderAlbumsDto, SetAlbumCoverDto, UpdateAlbumDto } from './album.dto';

@Controller('tenants/:tenantId/albums')
export class AlbumsController {
  constructor(private readonly albums: AlbumsService) {}

  @Get()
  list(
    @Param('tenantId') tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.albums.list(tenantId, createContext(user, request));
  }

  @Post()
  create(
    @Param('tenantId') tenantId: string,
    @Body() body: CreateAlbumDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.albums.create(tenantId, body, createContext(user, request));
  }

  @Patch('reorder')
  reorder(
    @Param('tenantId') tenantId: string,
    @Body() body: ReorderAlbumsDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.albums.reorder(tenantId, body.albumIds, createContext(user, request));
  }

  @Patch(':albumId')
  update(
    @Param('tenantId') tenantId: string,
    @Param('albumId') albumId: string,
    @Body() body: UpdateAlbumDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.albums.update(tenantId, albumId, body, createContext(user, request));
  }

  @Patch(':albumId/cover')
  setCover(
    @Param('tenantId') tenantId: string,
    @Param('albumId') albumId: string,
    @Body() body: SetAlbumCoverDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.albums.setCover(tenantId, albumId, body.mediaId, createContext(user, request));
  }

  @Delete(':albumId')
  delete(
    @Param('tenantId') tenantId: string,
    @Param('albumId') albumId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.albums.delete(tenantId, albumId, createContext(user, request));
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
