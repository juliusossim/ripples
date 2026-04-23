import {
  normalizeExternalMediaUrl,
  readDefaultAlt,
  resolveImportedMediaType,
} from './media-upload.utils';

describe('media-upload utils', () => {
  it('normalizes dropbox links to direct asset urls', () => {
    expect(
      normalizeExternalMediaUrl('dropbox', 'https://www.dropbox.com/s/example/listing.jpg?dl=0'),
    ).toContain('dl.dropboxusercontent.com/s/example/listing.jpg');
  });

  it('normalizes google drive share links to download urls', () => {
    expect(
      normalizeExternalMediaUrl(
        'google-drive',
        'https://drive.google.com/file/d/abc123/view?usp=sharing',
      ),
    ).toBe('https://drive.google.com/uc?export=download&id=abc123');
  });

  it('falls back to a preferred media type when a provider url has no extension', () => {
    expect(
      resolveImportedMediaType({
        preferredType: 'video',
        provider: 'google-drive',
        url: 'https://drive.google.com/file/d/abc123/view?usp=sharing',
      }),
    ).toBe('video');
  });

  it('derives a readable alt label from a file name', () => {
    expect(readDefaultAlt('sunset-villa_exterior.jpg')).toBe('sunset villa exterior');
  });
});
