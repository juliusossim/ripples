import {
  IMAGE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  VIDEO_EXTENSIONS,
  VIDEO_MIME_TYPES,
} from './media.constants';
import type { MediaSource, MediaType } from './media.types';

export function getMediaTypeFromMime(mimeType: string | undefined): MediaType {
  if (!mimeType) {
    return 'unknown';
  }

  const normalized = mimeType.toLowerCase().trim();

  if (IMAGE_MIME_TYPES.has(normalized)) {
    return 'image';
  }

  if (VIDEO_MIME_TYPES.has(normalized)) {
    return 'video';
  }

  if (normalized.startsWith('image/')) {
    return 'image';
  }

  if (normalized.startsWith('video/')) {
    return 'video';
  }

  return 'unknown';
}

export function getMediaTypeFromExtension(url: string): MediaType {
  try {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const extension = cleanUrl.split('.').pop()?.toLowerCase();

    if (!extension) {
      return 'unknown';
    }

    if (IMAGE_EXTENSIONS.has(extension)) {
      return 'image';
    }

    if (VIDEO_EXTENSIONS.has(extension)) {
      return 'video';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export function detectMediaType(source: MediaSource): MediaType {
  const mimeType = getMediaTypeFromMime(source.mimeType);
  if (mimeType !== 'unknown') {
    return mimeType;
  }

  return getMediaTypeFromExtension(source.url);
}

export function isVideo(source: MediaSource): boolean {
  return detectMediaType(source) === 'video';
}

export function isImage(source: MediaSource): boolean {
  return detectMediaType(source) === 'image';
}

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
