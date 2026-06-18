import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PERMISSIONS } from '@the-wedding/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { ScaleService } from '../application/scale.service';
import {
  CreateGreetingRuleDto,
  GrantEntitlementDto,
  HandleQueryDto,
  RecordAnalyticsEventDto,
  RecordPaymentEventDto,
  UpdateHandleDto,
} from './scale.dto';

@Controller('scale')
export class ScaleController {
  constructor(private readonly scale: ScaleService) {}

  @Public()
  @Get('catalog')
  catalog() {
    return this.scale.getCatalog();
  }

  @Public()
  @Get('handles/availability')
  checkHandle(@Query() query: HandleQueryDto) {
    return this.scale.checkHandleAvailability(query.handle);
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.scale.getMyProfile(user);
  }

  @Patch('me/handle')
  updateHandle(
    @Body() body: UpdateHandleDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.scale.updateMyHandle(body.handle, createContext(user, request));
  }

  @Get('tenants/:tenantId/summary')
  tenantSummary(@Param('tenantId') tenantId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.scale.getTenantScaleSummary(tenantId, user);
  }

  @Public()
  @Post('analytics/events')
  recordAnalytics(
    @Body() body: RecordAnalyticsEventDto,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    return this.scale.recordAnalyticsEvent(body, user);
  }

  @Get('admin/overview')
  @Permissions(PERMISSIONS.ADMIN_ACCESS)
  adminOverview() {
    return this.scale.getAdminOverview();
  }

  @Post('admin/entitlements')
  @Permissions(PERMISSIONS.ADMIN_ACCESS)
  grantEntitlement(
    @Body() body: GrantEntitlementDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.scale.grantEntitlement(body, createContext(user, request));
  }

  @Post('admin/payment-events')
  @Permissions(PERMISSIONS.ADMIN_ACCESS)
  recordPaymentEvent(
    @Body() body: RecordPaymentEventDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.scale.recordPaymentEvent(body, createContext(user, request));
  }

  @Post('admin/greeting-rules')
  @Permissions(PERMISSIONS.ADMIN_ACCESS)
  createGreetingRule(
    @Body() body: CreateGreetingRuleDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.scale.createGreetingRule(body, createContext(user, request));
  }
}

function createContext(user: AuthenticatedUser, request: Request) {
  return {
    actorUserId: user.id,
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
  };
}
