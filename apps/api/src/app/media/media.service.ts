import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { UploadedMediaAsset } from '@org/types';
import { detectSupportedMediaType, getPreferredExtensionForMimeType } from '@org/utils';
import { randomUUID } from 'node:crypto';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';

const fallbackExtensionByType = {
  image: 'jpg',
  video: 'mp4',
} as const;

export interface MediaUploadFile {
  readonly buffer: Buffer;
  readonly mimetype: string;
  readonly originalname: string;
}

export interface MediaRequestOrigin {
  readonly host: string;
  readonly protocol: string;
}

@Injectable()
export class MediaService {
  private readonly uploadDirectory = resolve(
    process.env.RIPPLES_UPLOAD_DIR ?? join(process.cwd(), '.cache', 'ripples-media'),
  );

  async uploadFiles(
    files: readonly MediaUploadFile[],
    origin: MediaRequestOrigin,
  ): Promise<UploadedMediaAsset[]> {
    if (files.length === 0) {
      throw new BadRequestException('Select at least one media file to upload.');
    }

    await mkdir(this.uploadDirectory, { recursive: true });

    return Promise.all(files.map((file) => this.persistFile(file, origin)));
  }

  async resolveStoredFilePath(fileName: string): Promise<string> {
    const safeFileName = basename(fileName);

    if (safeFileName !== fileName) {
      throw new NotFoundException('Media asset not found.');
    }

    const filePath = join(this.uploadDirectory, safeFileName);

    try {
      await access(filePath);
    } catch {
      throw new NotFoundException('Media asset not found.');
    }

    return filePath;
  }

  private async persistFile(
    file: MediaUploadFile,
    origin: MediaRequestOrigin,
  ): Promise<UploadedMediaAsset> {
    const type = detectSupportedMediaType({
      fileNameOrUrl: file.originalname,
      mimeType: file.mimetype,
    });

    if (!type) {
      throw new BadRequestException(`Unsupported media format for "${file.originalname}".`);
    }

    const fileExtension =
      getPreferredExtensionForMimeType(file.mimetype) ??
      extname(file.originalname).replace(/^\./, '').toLowerCase() ??
      fallbackExtensionByType[type];
    const safeExtension = fileExtension || fallbackExtensionByType[type];
    const storedFileName = `${Date.now()}-${randomUUID()}.${safeExtension}`;
    const storedFilePath = join(this.uploadDirectory, storedFileName);

    await writeFile(storedFilePath, file.buffer);

    return {
      url: `${origin.protocol}://${origin.host}/api/media/uploads/${storedFileName}`,
      type,
      originalName: file.originalname,
      mimeType: file.mimetype,
      source: 'device',
    };
  }
}
