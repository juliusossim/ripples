import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { MediaService } from './media.service';

describe('MediaService', () => {
  const uploadDirectory = join(process.cwd(), '.tmp', 'media-service-spec');
  let service: MediaService;

  beforeEach(() => {
    process.env.RIPPLES_UPLOAD_DIR = uploadDirectory;
    service = new MediaService();
  });

  afterEach(async () => {
    delete process.env.RIPPLES_UPLOAD_DIR;
    await rm(uploadDirectory, { recursive: true, force: true });
  });

  it('stores supported uploads and returns API urls', async () => {
    const [asset] = await service.uploadFiles(
      [
        {
          buffer: Buffer.from('binary'),
          mimetype: 'image/jpeg',
          originalname: 'listing.jpg',
        },
      ],
      { host: 'localhost:3000', protocol: 'http' },
    );

    expect(asset.type).toBe('image');
    expect(asset.url).toContain('/api/media/uploads/');
    expect(asset.source).toBe('device');
  });

  it('rejects unsupported media formats', async () => {
    await expect(
      service.uploadFiles(
        [
          {
            buffer: Buffer.from('binary'),
            mimetype: 'application/pdf',
            originalname: 'brochure.pdf',
          },
        ],
        { host: 'localhost:3000', protocol: 'http' },
      ),
    ).rejects.toThrow('Unsupported media format');
  });
});
