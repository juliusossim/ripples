export type SupportedMediaType = 'image' | 'video';

export const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/avif',
  'image/heic',
  'image/heif',
]);

export const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/mpeg',
  'video/3gpp',
  'video/x-m4v',
]);

export const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'bmp',
  'tiff',
  'avif',
  'heic',
  'heif',
]);

export const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'ogg',
  'mov',
  'avi',
  'mkv',
  'mpeg',
  'mpg',
  '3gp',
  'm4v',
]);

const preferredExtensionByMimeType: Record<string, string> = {
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/webp': 'webp',
  'video/3gpp': '3gp',
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
  'video/ogg': 'ogg',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/x-m4v': 'm4v',
  'video/x-matroska': 'mkv',
  'video/x-msvideo': 'avi',
};

function normalizeMimeType(mimeType: string | undefined): string | undefined {
  const normalized = mimeType?.toLowerCase().trim();

  return normalized ? normalized : undefined;
}

function extractExtension(candidate: string): string | undefined {
  const cleanCandidate = candidate.split('?')[0].split('#')[0];
  const extension = cleanCandidate.split('.').pop()?.toLowerCase().trim();

  return extension ? extension : undefined;
}

export function getMediaTypeFromMimeType(
  mimeType: string | undefined,
): SupportedMediaType | undefined {
  const normalizedMimeType = normalizeMimeType(mimeType);

  if (!normalizedMimeType) {
    return undefined;
  }

  if (IMAGE_MIME_TYPES.has(normalizedMimeType) || normalizedMimeType.startsWith('image/')) {
    return 'image';
  }

  if (VIDEO_MIME_TYPES.has(normalizedMimeType) || normalizedMimeType.startsWith('video/')) {
    return 'video';
  }

  return undefined;
}

export function getMediaTypeFromFileName(
  fileNameOrUrl: string | undefined,
): SupportedMediaType | undefined {
  if (!fileNameOrUrl) {
    return undefined;
  }

  const extension = extractExtension(fileNameOrUrl);

  if (!extension) {
    return undefined;
  }

  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return 'video';
  }

  return undefined;
}

export function detectSupportedMediaType(input: {
  readonly fileNameOrUrl?: string;
  readonly mimeType?: string;
}): SupportedMediaType | undefined {
  return getMediaTypeFromMimeType(input.mimeType) ?? getMediaTypeFromFileName(input.fileNameOrUrl);
}

export function getPreferredExtensionForMimeType(mimeType: string | undefined): string | undefined {
  const normalizedMimeType = normalizeMimeType(mimeType);

  return normalizedMimeType ? preferredExtensionByMimeType[normalizedMimeType] : undefined;
}

export function isSupportedMediaMimeType(mimeType: string | undefined): boolean {
  return getMediaTypeFromMimeType(mimeType) !== undefined;
}

export function isSupportedMediaFileName(fileNameOrUrl: string | undefined): boolean {
  return getMediaTypeFromFileName(fileNameOrUrl) !== undefined;
}

export function buildMediaInputAcceptAttribute(): string {
  return [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].map((extension) => `.${extension}`).join(',');
}
