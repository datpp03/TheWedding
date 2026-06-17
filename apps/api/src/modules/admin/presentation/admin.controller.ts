import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { PERMISSIONS } from '@the-wedding/shared';
import { AdminService } from '../application/admin.service';
import {
  AdminListQueryDto,
  AuditLogQueryDto,
  UpdateMediaModerationDto,
  UpdateSystemParametersDto,
  UpdateTenantStatusDto,
  UpdateUserRolesDto,
  UpdateUserStatusDto,
  UpsertFeatureFlagDto,
  UpsertSettingDto,
} from './admin.dto';

@Controller('admin')
@Permissions(PERMISSIONS.ADMIN_ACCESS)
@Throttle({ default: { limit: 60, ttl: 60_000 } })
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('users')
  listUsers(@Query() query: AdminListQueryDto) {
    return this.admin.listUsers(query);
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.admin.getUser(id);
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') id: string,
    @Body() body: UpdateUserStatusDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.admin.updateUserStatus(id, body.status, createContext(user, request));
  }

  @Patch('users/:id/roles')
  updateUserRoles(
    @Param('id') id: string,
    @Body() body: UpdateUserRolesDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.admin.updateUserRoles(id, body.roleCodes, createContext(user, request));
  }

  @Get('tenants')
  listTenants(@Query() query: AdminListQueryDto) {
    return this.admin.listTenants(query);
  }

  @Get('tenants/:id')
  getTenant(@Param('id') id: string) {
    return this.admin.getTenant(id);
  }

  @Patch('tenants/:id/status')
  updateTenantStatus(
    @Param('id') id: string,
    @Body() body: UpdateTenantStatusDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.admin.updateTenantStatus(id, body.status, createContext(user, request));
  }

  @Get('media')
  listMedia(@Query() query: AdminListQueryDto) {
    return this.admin.listMedia(query);
  }

  @Patch('media/:id/moderation')
  updateMediaStatus(
    @Param('id') id: string,
    @Body() body: UpdateMediaModerationDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.admin.updateMediaStatus(id, body.processingStatus, createContext(user, request));
  }

  @Get('audit-logs')
  listAuditLogs(@Query() query: AuditLogQueryDto) {
    return this.admin.listAuditLogs(query);
  }

  @Get('audit-logs/:id')
  getAuditLog(@Param('id') id: string) {
    return this.admin.getAuditLog(id);
  }

  @Get('settings')
  listSettings() {
    return this.admin.listSettings();
  }

  @Post('settings')
  upsertSetting(
    @Body() body: UpsertSettingDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.admin.upsertSetting(body, createContext(user, request));
  }

  @Get('feature-flags')
  listFeatureFlags() {
    return this.admin.listFeatureFlags();
  }

  @Post('feature-flags')
  upsertFeatureFlag(
    @Body() body: UpsertFeatureFlagDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.admin.upsertFeatureFlag(body, createContext(user, request));
  }

  @Get('system-parameters')
  getSystemParameters() {
    return this.admin.getSystemParameters();
  }

  @Patch('system-parameters')
  updateSystemParameters(
    @Body() body: UpdateSystemParametersDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.admin.updateSystemParameters(body, createContext(user, request));
  }
}

function createContext(user: AuthenticatedUser, request: Request) {
  return {
    actorUserId: user.id,
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
  };
}
