import { detectSupportedMediaType, type SupportedMediaType } from '@org/utils';
import type {
  ExternalMediaProvider,
  MediaUploadItem,
  MediaUploadSource,
} from './media-upload.types';

export function createMediaUploadId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createMediaUploadItem(input: {
  readonly alt: string;
  readonly id?: string;
  readonly mimeType?: string;
  readonly source: MediaUploadSource;
  readonly type: SupportedMediaType;
  readonly url: string;
}): MediaUploadItem {
  return {
    alt: input.alt,
    id: input.id ?? createMediaUploadId(),
    mimeType: input.mimeType,
    source: input.source,
    type: input.type,
    url: input.url,
  };
}

export function normalizeExternalMediaUrl(
  provider: ExternalMediaProvider,
  inputUrl: string,
): string {
  const url = new URL(inputUrl.trim());

  if (provider === 'dropbox') {
    url.hostname = 'dl.dropboxusercontent.com';
    url.searchParams.delete('dl');
    url.searchParams.set('raw', '1');

    return url.toString();
  }

  if (provider === 'google-drive') {
    const fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get('id');

    if (!fileId) {
      throw new Error('Enter a valid Google Drive file link.');
    }

    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  }

  return url.toString();
}

export function resolveImportedMediaType(input: {
  readonly preferredType: SupportedMediaType;
  readonly provider: ExternalMediaProvider;
  readonly url: string;
}): SupportedMediaType {
  const normalizedUrl = normalizeExternalMediaUrl(input.provider, input.url);

  return (
    detectSupportedMediaType({
      fileNameOrUrl: normalizedUrl,
    }) ?? input.preferredType
  );
}

export function readDefaultAlt(candidate: string): string {
  const fileName = candidate.split('?')[0].split('#')[0].split('/').pop() ?? candidate;
  const withoutExtension = fileName.replace(/\.[^.]+$/, '');
  const cleaned = withoutExtension.replace(/[-_]+/g, ' ').trim();

  return cleaned || 'Listing media';
}
