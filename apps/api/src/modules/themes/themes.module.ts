import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ThemesService } from './application/themes.service';
import { THEME_REPOSITORY } from './domain/theme.repository';
import { ThemeOrmEntity } from './infrastructure/theme.orm-entity';
import { TypeOrmThemeRepository } from './infrastructure/typeorm-theme.repository';
import { ThemesController } from './presentation/themes.controller';

@Module({
  imports: [AuditLogsModule, TenantsModule, TypeOrmModule.forFeature([ThemeOrmEntity])],
  controllers: [ThemesController],
  providers: [
    ThemesService,
    {
      provide: THEME_REPOSITORY,
      useClass: TypeOrmThemeRepository,
    },
  ],
  exports: [THEME_REPOSITORY, ThemesService, TypeOrmModule],
})
export class ThemesModule {}
