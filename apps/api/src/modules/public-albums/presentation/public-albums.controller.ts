import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { PublicAlbumsService } from '../application/public-albums.service';
import {
  AlbumSearchQueryDto,
  CreateReactionDto,
  CreateWishDto,
  FeaturedAlbumsQueryDto,
  UpdateReactionSymbolsDto,
} from './public-albums.dto';

@Controller()
export class PublicAlbumsController {
  constructor(private readonly publicAlbums: PublicAlbumsService) {}

  @Public()
  @Get('public/home')
  home() {
    return this.publicAlbums.home();
  }

  @Public()
  @Get('public/albums/featured')
  featured(@Query() query: FeaturedAlbumsQueryDto) {
    return this.publicAlbums.featured(query.window ?? 'week');
  }

  @Public()
  @Get('public/albums/:albumId')
  detail(@Param('albumId') albumId: string) {
    return this.publicAlbums.getPublicAlbum(albumId);
  }

  @Get('albums/search')
  search(
    @Query() query: AlbumSearchQueryDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.publicAlbums.search(query, createContext(user, request));
  }

  @Public()
  @Get('public/albums/:albumId/wishes')
  wishes(@Param('albumId') albumId: string) {
    return this.publicAlbums.listWishes(albumId);
  }

  @Post('albums/:albumId/wishes')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  createWish(
    @Param('albumId') albumId: string,
    @Body() body: CreateWishDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.publicAlbums.createWish(albumId, body, createContext(user, request));
  }

  @Public()
  @Get('public/albums/:albumId/reactions')
  reactions(@Param('albumId') albumId: string) {
    return this.publicAlbums.listReactionSummary(albumId);
  }

  @Post('albums/:albumId/reactions')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  createReaction(
    @Param('albumId') albumId: string,
    @Body() body: CreateReactionDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.publicAlbums.createReaction(albumId, body, createContext(user, request));
  }

  @Get('tenants/:tenantId/albums/:albumId/reaction-symbols')
  getReactionSymbols(
    @Param('tenantId') tenantId: string,
    @Param('albumId') albumId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.publicAlbums.getReactionSymbols(tenantId, albumId, createContext(user, request));
  }

  @Patch('tenants/:tenantId/albums/:albumId/reaction-symbols')
  updateReactionSymbols(
    @Param('tenantId') tenantId: string,
    @Param('albumId') albumId: string,
    @Body() body: UpdateReactionSymbolsDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.publicAlbums.updateReactionSymbols(
      tenantId,
      albumId,
      body,
      createContext(user, request),
    );
  }
}

function createContext(user: AuthenticatedUser, request: Request) {
  return {
    actorUserId: user.id,
    email: user.email,
    ipAddress: request.ip,
    tenantIds: user.tenantIds,
    userAgent: request.headers['user-agent'],
  };
}
