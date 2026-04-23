import {
  readDropboxPickerAvailability,
  readDropboxPickerConfig,
  readGooglePickerAvailability,
  readGooglePickerConfig,
} from './media-provider-config';

interface GlobalEnvOverride {
  __RIPPLES_MEDIA_UPLOAD_ENV__?: Record<string, string | undefined>;
}

function setImportMetaEnv(values: Record<string, string | undefined>): void {
  const globalObject = globalThis as GlobalEnvOverride;
  globalObject.__RIPPLES_MEDIA_UPLOAD_ENV__ = values;
}

describe('media-provider-config', () => {
  afterEach(() => {
    setImportMetaEnv({});
  });

  it('reads the Google picker config when all values are present', () => {
    setImportMetaEnv({
      VITE_GOOGLE_PICKER_API_KEY: 'api-key',
      VITE_GOOGLE_PICKER_APP_ID: 'app-id',
      VITE_GOOGLE_PICKER_CLIENT_ID: 'client-id',
    });

    expect(readGooglePickerConfig()).toEqual({
      apiKey: 'api-key',
      appId: 'app-id',
      clientId: 'client-id',
    });
    expect(readGooglePickerAvailability()).toEqual({ configured: true });
  });

  it('marks Google picker unavailable when values are missing', () => {
    setImportMetaEnv({
      VITE_GOOGLE_PICKER_API_KEY: 'api-key',
    });

    expect(readGooglePickerConfig()).toBeUndefined();
    expect(readGooglePickerAvailability().configured).toBe(false);
  });

  it('reads the Dropbox picker config when the app key is present', () => {
    setImportMetaEnv({
      VITE_DROPBOX_APP_KEY: 'dropbox-key',
    });

    expect(readDropboxPickerConfig()).toEqual({ appKey: 'dropbox-key' });
    expect(readDropboxPickerAvailability()).toEqual({ configured: true });
  });

  it('marks Dropbox picker unavailable when the app key is missing', () => {
    setImportMetaEnv({});

    expect(readDropboxPickerConfig()).toBeUndefined();
    expect(readDropboxPickerAvailability().configured).toBe(false);
  });
});
