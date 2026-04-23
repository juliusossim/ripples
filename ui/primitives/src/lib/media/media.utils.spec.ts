import {
  detectMediaType,
  formatVideoTime,
  getMediaTypeFromExtension,
  getMediaTypeFromMime,
  isImage,
  isVideo,
} from './media.utils';

describe('media.utils', () => {
  it('detects media type from mime type', () => {
    expect(getMediaTypeFromMime('image/jpeg')).toBe('image');
    expect(getMediaTypeFromMime('video/mp4')).toBe('video');
    expect(getMediaTypeFromMime('application/pdf')).toBe('unknown');
  });

  it('detects media type from extension when mime type is missing', () => {
    expect(getMediaTypeFromExtension('https://cdn.example.com/photo.webp?size=lg')).toBe('image');
    expect(getMediaTypeFromExtension('https://cdn.example.com/clip.m4v#preview')).toBe('video');
    expect(getMediaTypeFromExtension('https://cdn.example.com/file.bin')).toBe('unknown');
  });

  it('prefers mime type over extension', () => {
    expect(
      detectMediaType({
        url: 'https://cdn.example.com/video.mp4',
        mimeType: 'image/jpeg',
      }),
    ).toBe('image');
  });

  it('checks video and image helpers', () => {
    expect(isVideo({ url: 'https://cdn.example.com/video.mp4' })).toBe(true);
    expect(isImage({ url: 'https://cdn.example.com/photo.jpg' })).toBe(true);
  });

  it('formats video time safely', () => {
    expect(formatVideoTime(0)).toBe('0:00');
    expect(formatVideoTime(65)).toBe('1:05');
    expect(formatVideoTime(3661)).toBe('1:01:01');
    expect(formatVideoTime(Number.NaN)).toBe('0:00');
    expect(formatVideoTime(-5)).toBe('0:00');
  });
});
