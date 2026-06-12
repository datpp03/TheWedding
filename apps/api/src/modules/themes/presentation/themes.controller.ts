import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { ThemesService } from '../application/themes.service';
import { CreateThemeDto, ThemePayloadDto } from './theme.dto';

@Controller()
export class ThemesController {
  constructor(private readonly themes: ThemesService) {}

  @Get('theme-presets')
  presets() {
    return this.themes.presets();
  }

  @Post('theme-preview')
  preview(@Body() body: ThemePayloadDto) {
    return this.themes.preview(body);
  }

  @Get('tenants/:tenantId/themes')
  list(
    @Param('tenantId') tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.themes.list(tenantId, createContext(user, request));
  }

  @Get('tenants/:tenantId/themes/active')
  active(
    @Param('tenantId') tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.themes.active(tenantId, createContext(user, request));
  }

  @Post('tenants/:tenantId/themes')
  create(
    @Param('tenantId') tenantId: string,
    @Body() body: CreateThemeDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.themes.create(tenantId, body, createContext(user, request));
  }

  @Patch('tenants/:tenantId/themes/:themeId')
  update(
    @Param('tenantId') tenantId: string,
    @Param('themeId') themeId: string,
    @Body() body: ThemePayloadDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.themes.update(tenantId, themeId, body, createContext(user, request));
  }

  @Patch('tenants/:tenantId/themes/:themeId/activate')
  activate(
    @Param('tenantId') tenantId: string,
    @Param('themeId') themeId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.themes.activate(tenantId, themeId, createContext(user, request));
  }

  @Post('tenants/:tenantId/themes/:themeId/clone')
  clone(
    @Param('tenantId') tenantId: string,
    @Param('themeId') themeId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.themes.clone(tenantId, themeId, createContext(user, request));
  }

  @Post('tenants/:tenantId/themes/reset')
  reset(
    @Param('tenantId') tenantId: string,
    @Query('presetId') presetId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.themes.reset(tenantId, createContext(user, request), presetId);
  }
}

function createContext(user: AuthenticatedUser, request: Request) {
  return {
    actorUserId: user.id,
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
  };
}
