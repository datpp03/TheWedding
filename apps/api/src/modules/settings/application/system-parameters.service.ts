import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { z } from 'zod';
import { SystemSettingOrmEntity } from '../infrastructure/system-setting.orm-entity';

export const SYSTEM_PARAMETERS_KEY = 'runtime.system_parameters';

export const systemParametersSchema = z.object({
  disableDownloads: z.boolean().default(false),
  disableLogin: z.boolean().default(false),
  disableNewUserRegistration: z.boolean().default(false),
  disablePaymentCheckout: z.boolean().default(false),
  disablePublicGallery: z.boolean().default(false),
  disableUploads: z.boolean().default(false),
  maintenanceMessage: z.string().max(500).default(''),
});

export type SystemParameters = z.infer<typeof systemParametersSchema>;

export const DEFAULT_SYSTEM_PARAMETERS: SystemParameters = {
  disableDownloads: false,
  disableLogin: false,
  disableNewUserRegistration: false,
  disablePaymentCheckout: false,
  disablePublicGallery: false,
  disableUploads: false,
  maintenanceMessage: '',
};

@Injectable()
export class SystemParametersService {
  private cache: { expiresAt: number; value: SystemParameters } | null = null;

  constructor(
    @InjectRepository(SystemSettingOrmEntity)
    private readonly settings: Repository<SystemSettingOrmEntity>,
  ) {}

  async getParameters(): Promise<SystemParameters> {
    if (this.cache && this.cache.expiresAt > Date.now()) {
      return this.cache.value;
    }

    const row = await this.settings.findOne({ where: { key: SYSTEM_PARAMETERS_KEY } });
    const value = parseParameters(row?.valueJson);
    this.cache = { expiresAt: Date.now() + 30_000, value };
    return value;
  }

  async updateParameters(input: Partial<SystemParameters>): Promise<SystemParameters> {
    const current = await this.getParameters();
    const next = systemParametersSchema.parse({ ...current, ...input });
    const valueJson = JSON.stringify(next);
    const existing = await this.settings.findOne({ where: { key: SYSTEM_PARAMETERS_KEY } });

    if (existing) {
      existing.valueJson = valueJson;
      existing.description = 'Runtime feature controls and maintenance messages.';
      await this.settings.save(existing);
    } else {
      await this.settings.save(
        this.settings.create({
          description: 'Runtime feature controls and maintenance messages.',
          key: SYSTEM_PARAMETERS_KEY,
          valueJson,
        }),
      );
    }

    this.invalidate();
    return next;
  }

  invalidate() {
    this.cache = null;
  }

  async assertRegistrationEnabled() {
    const parameters = await this.getParameters();
    if (parameters.disableNewUserRegistration) {
      throw new ServiceUnavailableException(
        parameters.maintenanceMessage || 'New user registration is temporarily disabled',
      );
    }
  }

  async assertLoginEnabled() {
    const parameters = await this.getParameters();
    if (parameters.disableLogin) {
      throw new ServiceUnavailableException(
        parameters.maintenanceMessage || 'Login is temporarily disabled',
      );
    }
  }

  async assertUploadEnabled() {
    const parameters = await this.getParameters();
    if (parameters.disableUploads) {
      throw new ServiceUnavailableException(
        parameters.maintenanceMessage || 'Uploads are temporarily disabled',
      );
    }
  }

  async assertDownloadEnabled() {
    const parameters = await this.getParameters();
    if (parameters.disableDownloads) {
      throw new ServiceUnavailableException(
        parameters.maintenanceMessage || 'Downloads are temporarily disabled',
      );
    }
  }

  async assertPublicGalleryEnabled() {
    const parameters = await this.getParameters();
    if (parameters.disablePublicGallery) {
      throw new ServiceUnavailableException(
        parameters.maintenanceMessage || 'Public gallery is temporarily disabled',
      );
    }
  }

  async assertPaymentCheckoutEnabled() {
    const parameters = await this.getParameters();
    if (parameters.disablePaymentCheckout) {
      throw new ServiceUnavailableException(
        parameters.maintenanceMessage || 'Payment checkout is temporarily disabled',
      );
    }
  }
}

function parseParameters(valueJson: string | null | undefined): SystemParameters {
  if (!valueJson) {
    return DEFAULT_SYSTEM_PARAMETERS;
  }

  try {
    return systemParametersSchema.parse(JSON.parse(valueJson));
  } catch {
    return DEFAULT_SYSTEM_PARAMETERS;
  }
}
