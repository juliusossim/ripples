export type MediaType = 'image' | 'video';

export interface Media {
  id: string;
  url: string;
  type: MediaType;
  alt: string;
}

export type MediaUploadSource = 'device' | 'dropbox' | 'google-drive' | 'direct-url';

export interface UploadedMediaAsset {
  url: string;
  type: MediaType;
  originalName: string;
  mimeType: string;
  source: MediaUploadSource;
}
