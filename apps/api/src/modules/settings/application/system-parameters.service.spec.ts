import { ServiceUnavailableException } from '@nestjs/common';
import { DEFAULT_SYSTEM_PARAMETERS, SystemParametersService } from './system-parameters.service';

describe(SystemParametersService.name, () => {
  type SettingRow = { key: string; valueJson: string };

  function createService(valueJson: string | null = null) {
    let row: SettingRow | null = valueJson ? { key: 'runtime.system_parameters', valueJson } : null;
    const settings = {
      create: jest.fn((input: SettingRow) => ({ ...input })),
      findOne: jest.fn().mockImplementation(() => Promise.resolve(row)),
      save: jest.fn().mockImplementation((input: SettingRow) => {
        row = input;
        return Promise.resolve(input);
      }),
    };

    return {
      service: new SystemParametersService(settings as never),
      settings,
    };
  }

  it('falls back to safe defaults when stored parameters are invalid', async () => {
    const { service } = createService('not-json');

    await expect(service.getParameters()).resolves.toEqual(DEFAULT_SYSTEM_PARAMETERS);
  });

  it('invalidates cached values after an update', async () => {
    const { service, settings } = createService();

    await service.getParameters();
    await service.updateParameters({ disableUploads: true });

    expect(settings.findOne).toHaveBeenCalledTimes(2);
    await expect(service.assertUploadEnabled()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('blocks read-only public mode switches through dedicated assertions', async () => {
    const { service } = createService(
      JSON.stringify({
        ...DEFAULT_SYSTEM_PARAMETERS,
        disableDownloads: true,
        disableLogin: true,
        disableNewUserRegistration: true,
        disablePaymentCheckout: true,
        disablePublicGallery: true,
      }),
    );

    await expect(service.assertRegistrationEnabled()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    await expect(service.assertLoginEnabled()).rejects.toBeInstanceOf(ServiceUnavailableException);
    await expect(service.assertDownloadEnabled()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    await expect(service.assertPublicGalleryEnabled()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    await expect(service.assertPaymentCheckoutEnabled()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
