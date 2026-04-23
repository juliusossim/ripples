interface RuntimeEnv {
  readonly [key: string]: string | undefined;
}

interface ImportMetaWithEnv {
  readonly env?: RuntimeEnv;
}

interface GlobalEnvOverride {
  __RIPPLES_MEDIA_UPLOAD_ENV__?: RuntimeEnv;
}

export interface GooglePickerConfig {
  readonly apiKey: string;
  readonly appId: string;
  readonly clientId: string;
}

export interface DropboxPickerConfig {
  readonly appKey: string;
}

export interface MediaProviderAvailability {
  readonly configured: boolean;
  readonly hint?: string;
}

function readRuntimeEnv(): RuntimeEnv {
  const override = (globalThis as GlobalEnvOverride).__RIPPLES_MEDIA_UPLOAD_ENV__;

  return override ?? (((import.meta as ImportMetaWithEnv).env ?? {}) as RuntimeEnv);
}

function readEnvValue(key: string): string | undefined {
  return readRuntimeEnv()[key]?.trim() || undefined;
}

export function readGooglePickerConfig(): GooglePickerConfig | undefined {
  const apiKey = readEnvValue('VITE_GOOGLE_PICKER_API_KEY');
  const appId = readEnvValue('VITE_GOOGLE_PICKER_APP_ID');
  const clientId = readEnvValue('VITE_GOOGLE_PICKER_CLIENT_ID');

  if (!apiKey || !appId || !clientId) {
    return undefined;
  }

  return {
    apiKey,
    appId,
    clientId,
  };
}

export function readDropboxPickerConfig(): DropboxPickerConfig | undefined {
  const appKey = readEnvValue('VITE_DROPBOX_APP_KEY');

  if (!appKey) {
    return undefined;
  }

  return { appKey };
}

export function readGooglePickerAvailability(): MediaProviderAvailability {
  return readGooglePickerConfig()
    ? { configured: true }
    : {
        configured: false,
        hint:
          'Set VITE_GOOGLE_PICKER_API_KEY, VITE_GOOGLE_PICKER_APP_ID, and ' +
          'VITE_GOOGLE_PICKER_CLIENT_ID to enable Google Drive.',
      };
}

export function readDropboxPickerAvailability(): MediaProviderAvailability {
  return readDropboxPickerConfig()
    ? { configured: true }
    : {
        configured: false,
        hint: 'Set VITE_DROPBOX_APP_KEY to enable Dropbox.',
      };
}
