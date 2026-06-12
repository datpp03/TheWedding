import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { TenantsService } from '../application/tenants.service';
import {
  CreateTenantDto,
  UpdateTenantDto,
  UpdateTenantSettingsDto,
  UpdateTenantVisibilityDto,
} from './tenant.dto';

@Controller()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('tenants')
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.tenantsService.list(user.id);
  }

  @Post('tenants')
  create(
    @Body() body: CreateTenantDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.tenantsService.create(body, createContext(user, request));
  }

  @Get('tenants/slug-check')
  checkSlug(@Query('slug') slug: string, @Query('excludeTenantId') excludeTenantId?: string) {
    return this.tenantsService.checkSlug(slug, excludeTenantId);
  }

  @Get('tenants/:tenantId')
  get(@Param('tenantId') tenantId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.tenantsService.get(tenantId, user.id);
  }

  @Patch('tenants/:tenantId')
  update(
    @Param('tenantId') tenantId: string,
    @Body() body: UpdateTenantDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.tenantsService.update(tenantId, body, createContext(user, request));
  }

  @Patch('tenants/:tenantId/settings')
  updateSettings(
    @Param('tenantId') tenantId: string,
    @Body() body: UpdateTenantSettingsDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.tenantsService.updateSettings(tenantId, body, createContext(user, request));
  }

  @Patch('tenants/:tenantId/visibility')
  updateVisibility(
    @Param('tenantId') tenantId: string,
    @Body() body: UpdateTenantVisibilityDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.tenantsService.updateVisibility(
      tenantId,
      body.visibility,
      body.password,
      createContext(user, request),
    );
  }

  @Delete('tenants/:tenantId')
  delete(
    @Param('tenantId') tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.tenantsService.delete(tenantId, createContext(user, request));
  }

  @Public()
  @Get('public/sites/:slug')
  publicSite(@Param('slug') slug: string, @Query('password') password?: string) {
    return this.tenantsService.getPublicSite(slug, password);
  }
}

function createContext(user: AuthenticatedUser, request: Request) {
  return {
    actorUserId: user.id,
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
  };
}
