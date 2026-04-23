import type { SupportedMediaType } from '@org/utils';

export type ExternalMediaProvider = 'dropbox' | 'google-drive' | 'direct-url';
export type MediaUploadSource = 'device' | ExternalMediaProvider;

export interface UploadedMediaAssetInput {
  readonly mimeType: string;
  readonly originalName: string;
  readonly type: SupportedMediaType;
  readonly url: string;
}

export interface MediaUploadItem {
  readonly alt: string;
  readonly id: string;
  readonly mimeType?: string;
  readonly source: MediaUploadSource;
  readonly type: SupportedMediaType;
  readonly url: string;
}

export interface MediaUploadProps {
  readonly disabled?: boolean;
  readonly error?: string;
  readonly maxItems?: number;
  readonly onChange: (items: MediaUploadItem[]) => void;
  readonly onUploadFiles: (files: File[]) => Promise<readonly UploadedMediaAssetInput[]>;
  readonly value: readonly MediaUploadItem[];
}
