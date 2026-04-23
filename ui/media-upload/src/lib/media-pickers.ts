import { buildMediaInputAcceptAttribute, IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from '@org/utils';
import type { DropboxPickerConfig, GooglePickerConfig } from './media-provider-config';
import { normalizeExternalMediaUrl } from './media-upload.utils';

interface PickedGoogleDocument {
  readonly id?: string;
  readonly mimeType?: string;
  readonly name?: string;
}

const googlePickerScope = 'https://www.googleapis.com/auth/drive.readonly';
const googleApisScriptUrl = 'https://apis.google.com/js/api.js';
const googleIdentityScriptUrl = 'https://accounts.google.com/gsi/client';
const dropboxScriptUrl = 'https://www.dropbox.com/static/api/2/dropins.js';

const allowedMimeTypes = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES];
const allowedExtensions = buildMediaInputAcceptAttribute()
  .split(',')
  .map((extension) => extension.trim())
  .filter(Boolean);

let googleApisReadyPromise: Promise<void> | undefined;
let dropboxReadyPromise: Promise<void> | undefined;

function ensureBrowserRuntime(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Cloud pickers are only available in the browser.');
  }
}

function loadScript(
  id: string,
  source: string,
  attributes: Record<string, string> = {},
): Promise<void> {
  ensureBrowserRuntime();

  const existingScript = document.getElementById(id) as HTMLScriptElement | null;
  if (existingScript) {
    if (existingScript.dataset.loaded === 'true') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error(`Failed to load script: ${source}`)),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = source;
    script.async = true;

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true },
    );
    script.addEventListener('error', () => reject(new Error(`Failed to load script: ${source}`)), {
      once: true,
    });

    document.head.appendChild(script);
  });
}

async function ensureGoogleApisReady(): Promise<void> {
  if (!googleApisReadyPromise) {
    googleApisReadyPromise = (async () => {
      await Promise.all([
        loadScript('ripples-google-identity', googleIdentityScriptUrl),
        loadScript('ripples-google-apis', googleApisScriptUrl),
      ]);

      if (!window.gapi || !window.google) {
        throw new Error('Google picker scripts did not initialize correctly.');
      }

      await new Promise<void>((resolve, reject) => {
        window.gapi?.load('picker', {
          callback: resolve,
          onerror: () => reject(new Error('Failed to load the Google picker module.')),
        });
      });
    })();
  }

  await googleApisReadyPromise;
}

async function ensureDropboxReady(appKey: string): Promise<void> {
  if (!dropboxReadyPromise) {
    dropboxReadyPromise = loadScript('ripples-dropbox-sdk', dropboxScriptUrl, {
      'data-app-key': appKey,
      id: 'ripples-dropbox-sdk',
    }).then(() => {
      if (!window.Dropbox) {
        throw new Error('Dropbox picker script did not initialize correctly.');
      }
    });
  }

  await dropboxReadyPromise;
}

async function requestGoogleAccessToken(clientId: string): Promise<string> {
  await ensureGoogleApisReady();

  return new Promise((resolve, reject) => {
    const googleIdentity = window.google?.accounts.oauth2;
    if (!googleIdentity) {
      reject(new Error('Google authentication is unavailable.'));

      return;
    }

    const tokenClient = googleIdentity.initTokenClient({
      callback: (response) => {
        if (!response.access_token) {
          reject(
            new Error(
              response.error_description ?? response.error ?? 'Google authentication failed.',
            ),
          );

          return;
        }

        resolve(response.access_token);
      },
      client_id: clientId,
      error_callback: () => reject(new Error('Google authentication was cancelled.')),
      scope: googlePickerScope,
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

async function pickGoogleDocuments(
  config: GooglePickerConfig,
  accessToken: string,
): Promise<PickedGoogleDocument[]> {
  await ensureGoogleApisReady();

  return new Promise((resolve, reject) => {
    const googlePicker = window.google?.picker;
    if (!googlePicker) {
      reject(new Error('Google picker is unavailable.'));

      return;
    }

    const docsView = new googlePicker.DocsView(googlePicker.ViewId.DOCS);

    docsView.setIncludeFolders(false);
    docsView.setSelectFolderEnabled(false);
    docsView.setMimeTypes(allowedMimeTypes.join(','));

    const picker = new googlePicker.PickerBuilder()
      .addView(docsView)
      .setAppId(config.appId)
      .setCallback((response) => {
        if (response.action === googlePicker.Action.CANCEL) {
          resolve([]);

          return;
        }

        if (response.action === googlePicker.Action.PICKED) {
          resolve((response.docs ?? []) as PickedGoogleDocument[]);

          return;
        }

        reject(new Error('Google picker returned an unexpected response.'));
      })
      .setDeveloperKey(config.apiKey)
      .setOAuthToken(accessToken)
      .build();

    picker.setVisible(true);
  });
}

async function fetchGoogleDocumentAsFile(
  accessToken: string,
  document: PickedGoogleDocument,
): Promise<File> {
  const documentId = document.id;
  const documentName = document.name;

  if (!documentId || !documentName) {
    throw new Error('Google picker did not return enough file information.');
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(documentId)}?alt=media`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to download ${documentName} from Google Drive.`);
  }

  const blob = await response.blob();
  const mimeType = document.mimeType || blob.type || 'application/octet-stream';

  return new File([blob], documentName, { type: mimeType });
}

export async function pickGoogleDriveFiles(config: GooglePickerConfig): Promise<File[]> {
  const accessToken = await requestGoogleAccessToken(config.clientId);
  const documents = await pickGoogleDocuments(config, accessToken);

  return Promise.all(documents.map((document) => fetchGoogleDocumentAsFile(accessToken, document)));
}

interface DropboxChoice {
  readonly link: string;
  readonly name: string;
}

async function chooseDropboxFiles(config: DropboxPickerConfig): Promise<DropboxChoice[]> {
  await ensureDropboxReady(config.appKey);

  return new Promise((resolve, reject) => {
    window.Dropbox?.choose({
      cancel: () => resolve([]),
      extensions: allowedExtensions,
      linkType: 'direct',
      multiselect: true,
      success: (files) => resolve(files.map((file) => ({ link: file.link, name: file.name }))),
    });

    if (!window.Dropbox) {
      reject(new Error('Dropbox picker is unavailable.'));
    }
  });
}

async function fetchDropboxChoiceAsFile(choice: DropboxChoice): Promise<File> {
  const normalizedUrl = normalizeExternalMediaUrl('dropbox', choice.link);
  const response = await fetch(normalizedUrl);

  if (!response.ok) {
    throw new Error(`Failed to download ${choice.name} from Dropbox.`);
  }

  const blob = await response.blob();

  return new File([blob], choice.name, {
    type: blob.type || 'application/octet-stream',
  });
}

export async function pickDropboxFiles(config: DropboxPickerConfig): Promise<File[]> {
  const choices = await chooseDropboxFiles(config);

  return Promise.all(choices.map((choice) => fetchDropboxChoiceAsFile(choice)));
}
