import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { UploadedMediaAsset } from '@org/types';
import { MediaService, type MediaUploadFile } from './media.service';

interface MediaRequest {
  readonly protocol: string;
  get(name: string): string | undefined;
}

interface MediaResponse {
  sendFile(path: string): void;
}

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      limits: {
        fileSize: 25 * 1024 * 1024,
        files: 12,
      },
    }),
  )
  upload(
    @UploadedFiles() files: MediaUploadFile[] | undefined,
    @Req() request: MediaRequest,
  ): Promise<UploadedMediaAsset[]> {
    return this.mediaService.uploadFiles(files ?? [], {
      host: request.get('host') ?? 'localhost:3000',
      protocol: request.protocol,
    });
  }

  @Get('uploads/:fileName')
  async serveUpload(
    @Param('fileName') fileName: string,
    @Res() response: MediaResponse,
  ): Promise<void> {
    const filePath = await this.mediaService.resolveStoredFilePath(fileName);

    response.sendFile(filePath);
  }
}
