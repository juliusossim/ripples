import {
  buildMediaInputAcceptAttribute,
  detectSupportedMediaType,
  getMediaTypeFromFileName,
  getMediaTypeFromMimeType,
  getPreferredExtensionForMimeType,
} from './media-formats.js';

describe('media-formats', () => {
  it('detects supported types from mime type', () => {
    expect(getMediaTypeFromMimeType('image/jpeg')).toBe('image');
    expect(getMediaTypeFromMimeType('video/mp4')).toBe('video');
  });

  it('detects supported types from file names and urls', () => {
    expect(getMediaTypeFromFileName('listing.jpg')).toBe('image');
    expect(getMediaTypeFromFileName('https://cdn.example.com/home.mp4?token=abc')).toBe('video');
  });

  it('prefers mime type detection when available', () => {
    expect(
      detectSupportedMediaType({
        fileNameOrUrl: 'listing.unknown',
        mimeType: 'image/png',
      }),
    ).toBe('image');
  });

  it('returns preferred extensions for stored uploads', () => {
    expect(getPreferredExtensionForMimeType('image/jpeg')).toBe('jpg');
    expect(getPreferredExtensionForMimeType('video/quicktime')).toBe('mov');
  });

  it('builds a browser accept attribute from allowed extensions', () => {
    expect(buildMediaInputAcceptAttribute()).toContain('.jpg');
    expect(buildMediaInputAcceptAttribute()).toContain('.mp4');
  });
});
