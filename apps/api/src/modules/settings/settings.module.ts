import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemParametersService } from './application/system-parameters.service';
import { FeatureFlagOrmEntity } from './infrastructure/feature-flag.orm-entity';
import { SystemSettingOrmEntity } from './infrastructure/system-setting.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlagOrmEntity, SystemSettingOrmEntity])],
  providers: [SystemParametersService],
  exports: [SystemParametersService, TypeOrmModule],
})
export class SettingsModule {}
