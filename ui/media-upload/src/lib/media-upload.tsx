import {
  buildMediaInputAcceptAttribute,
  detectSupportedMediaType,
  type SupportedMediaType,
} from '@org/utils';
import { Badge, Button, Card, Input, MediaRenderer, cn } from '@org/ui-primitives';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactElement,
} from 'react';
import {
  readDropboxPickerAvailability,
  readDropboxPickerConfig,
  readGooglePickerAvailability,
  readGooglePickerConfig,
} from './media-provider-config';
import { pickDropboxFiles, pickGoogleDriveFiles } from './media-pickers';
import type {
  ExternalMediaProvider,
  MediaUploadItem,
  MediaUploadProps,
} from './media-upload.types';
import {
  createMediaUploadItem,
  normalizeExternalMediaUrl,
  readDefaultAlt,
  resolveImportedMediaType,
} from './media-upload.utils';

const externalProviders = [
  {
    description: 'Paste a public media URL.',
    label: 'Web link',
    value: 'direct-url',
  },
  {
    description: 'Paste a public Dropbox share link.',
    label: 'Dropbox',
    value: 'dropbox',
  },
  {
    description: 'Paste a public Google Drive file link.',
    label: 'Google Drive',
    value: 'google-drive',
  },
] as const satisfies readonly {
  readonly description: string;
  readonly label: string;
  readonly value: ExternalMediaProvider;
}[];

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while processing media.';
}

function clampItems(
  existingItems: readonly MediaUploadItem[],
  incomingItems: readonly MediaUploadItem[],
  maxItems: number,
): MediaUploadItem[] {
  return [...existingItems, ...incomingItems].slice(0, maxItems);
}

function readExternalUrlPlaceholder(provider: ExternalMediaProvider): string {
  if (provider === 'dropbox') {
    return 'https://www.dropbox.com/...';
  }

  if (provider === 'google-drive') {
    return 'https://drive.google.com/file/d/...';
  }

  return 'https://example.com/media.jpg';
}

function readAvailabilityBadgeVariant(configured: boolean): 'default' | 'secondary' | 'outline' {
  if (configured) {
    return 'default';
  }

  return 'outline';
}

export function MediaUpload({
  disabled = false,
  error,
  maxItems = 12,
  onChange,
  onUploadFiles,
  value,
}: Readonly<MediaUploadProps>): ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [externalAlt, setExternalAlt] = useState('');
  const [externalProvider, setExternalProvider] = useState<ExternalMediaProvider>('direct-url');
  const [externalType, setExternalType] = useState<SupportedMediaType>('image');
  const [externalUrl, setExternalUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string>();

  const remainingSlots = Math.max(0, maxItems - value.length);
  const acceptedFileTypes = useMemo(() => buildMediaInputAcceptAttribute(), []);
  const displayError = localError ?? error;
  const externalUrlPlaceholder = readExternalUrlPlaceholder(externalProvider);
  const googlePickerAvailability = useMemo(() => readGooglePickerAvailability(), []);
  const dropboxPickerAvailability = useMemo(() => readDropboxPickerAvailability(), []);
  const providerStatuses = useMemo(
    () => [
      {
        configured: true,
        hint: 'Always available through drag and drop or file selection.',
        label: 'Device upload',
      },
      {
        configured: true,
        hint: 'Paste a public image or video URL directly into the form.',
        label: 'Web link',
      },
      {
        ...googlePickerAvailability,
        label: 'Google Drive',
      },
      {
        ...dropboxPickerAvailability,
        label: 'Dropbox',
      },
    ],
    [dropboxPickerAvailability, googlePickerAvailability],
  );

  const updateItems = useCallback(
    (items: MediaUploadItem[]): void => {
      setLocalError(undefined);
      onChange(items);
    },
    [onChange],
  );

  const removeItem = useCallback(
    (itemId: string): void => {
      updateItems(value.filter((item) => item.id !== itemId));
    },
    [updateItems, value],
  );

  const updateAlt = useCallback(
    (itemId: string, alt: string): void => {
      updateItems(value.map((item) => (item.id === itemId ? { ...item, alt } : item)));
    },
    [updateItems, value],
  );

  const uploadFiles = useCallback(
    async (files: readonly File[]): Promise<void> => {
      if (disabled || files.length === 0) {
        return;
      }

      if (remainingSlots === 0) {
        setLocalError(`You can add up to ${maxItems} media items per listing.`);

        return;
      }

      const limitedFiles = files.slice(0, remainingSlots);
      const unsupportedFile = limitedFiles.find(
        (file) =>
          detectSupportedMediaType({
            fileNameOrUrl: file.name,
            mimeType: file.type,
          }) === undefined,
      );

      if (unsupportedFile) {
        setLocalError(`"${unsupportedFile.name}" is not an allowed image or video format.`);

        return;
      }

      setIsUploading(true);
      setLocalError(undefined);

      try {
        const uploadedAssets = await onUploadFiles([...limitedFiles]);
        const uploadedItems = uploadedAssets.map((asset) =>
          createMediaUploadItem({
            alt: readDefaultAlt(asset.originalName),
            mimeType: asset.mimeType,
            source: 'device',
            type: asset.type,
            url: asset.url,
          }),
        );

        updateItems(clampItems(value, uploadedItems, maxItems));
      } catch (uploadError) {
        setLocalError(readErrorMessage(uploadError));
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, maxItems, onUploadFiles, remainingSlots, updateItems, value],
  );

  const handleFileSelection = useCallback(
    async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const input = event.currentTarget;
      const files = input.files ? Array.from(input.files) : [];

      await uploadFiles(files);
      input.value = '';
    },
    [uploadFiles],
  );

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>): Promise<void> => {
      event.preventDefault();
      setIsDragging(false);

      await uploadFiles(Array.from(event.dataTransfer.files ?? []));
    },
    [uploadFiles],
  );

  const importFromGoogleDrive = useCallback(async (): Promise<void> => {
    if (disabled || remainingSlots === 0) {
      return;
    }

    const config = readGooglePickerConfig();
    if (!config) {
      setLocalError(readGooglePickerAvailability().hint ?? 'Google Drive is not configured.');

      return;
    }

    try {
      setLocalError(undefined);
      const files = await pickGoogleDriveFiles(config);
      await uploadFiles(files);
    } catch (providerError) {
      setLocalError(readErrorMessage(providerError));
    }
  }, [disabled, remainingSlots, uploadFiles]);

  const importFromDropbox = useCallback(async (): Promise<void> => {
    if (disabled || remainingSlots === 0) {
      return;
    }

    const config = readDropboxPickerConfig();
    if (!config) {
      setLocalError(readDropboxPickerAvailability().hint ?? 'Dropbox is not configured.');

      return;
    }

    try {
      setLocalError(undefined);
      const files = await pickDropboxFiles(config);
      await uploadFiles(files);
    } catch (providerError) {
      setLocalError(readErrorMessage(providerError));
    }
  }, [disabled, remainingSlots, uploadFiles]);

  const addExternalMedia = useCallback((): void => {
    if (disabled) {
      return;
    }

    if (remainingSlots === 0) {
      setLocalError(`You can add up to ${maxItems} media items per listing.`);

      return;
    }

    try {
      const normalizedUrl = normalizeExternalMediaUrl(externalProvider, externalUrl);
      const type = resolveImportedMediaType({
        preferredType: externalType,
        provider: externalProvider,
        url: externalUrl,
      });

      updateItems(
        clampItems(
          value,
          [
            createMediaUploadItem({
              alt: externalAlt.trim() || readDefaultAlt(externalUrl),
              source: externalProvider,
              type,
              url: normalizedUrl,
            }),
          ],
          maxItems,
        ),
      );
      setExternalAlt('');
      setExternalUrl('');
      setLocalError(undefined);
    } catch (providerError) {
      setLocalError(readErrorMessage(providerError));
    }
  }, [
    disabled,
    externalAlt,
    externalProvider,
    externalType,
    externalUrl,
    maxItems,
    remainingSlots,
    updateItems,
    value,
  ]);

  return (
    <div className="grid gap-4">
      <Card className="grid gap-4 p-4">
        <div className="space-y-1">
          <p className="font-medium text-foreground">Picker status</p>
          <p className="text-sm text-muted-foreground">
            Quick environment check for every media source available in this composer.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {providerStatuses.map((provider) => (
            <div className="rounded-xl border border-border bg-muted/20 p-3" key={provider.label}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{provider.label}</p>
                <Badge variant={readAvailabilityBadgeVariant(provider.configured)}>
                  {provider.configured ? 'Ready' : 'Setup needed'}
                </Badge>
              </div>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">{provider.hint}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        className={cn(
          'border-dashed p-4 transition-colors',
          isDragging ? 'border-amber-400 bg-amber-50/50' : 'border-border',
          disabled ? 'opacity-60' : '',
        )}
      >
        <div
          className="grid gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 text-center"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          <div className="space-y-1">
            <p className="font-medium text-foreground">Drag media here or choose from device</p>
            <p className="text-sm text-muted-foreground">
              Supports up to {maxItems} items across images and videos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              disabled={disabled || isUploading || remainingSlots === 0}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              {isUploading ? 'Uploading...' : 'Choose files'}
            </Button>
            <Badge variant="secondary">
              {value.length}/{maxItems} selected
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            Allowed formats: JPG, PNG, GIF, WebP, SVG, BMP, TIFF, AVIF, HEIC, HEIF, MP4, WebM, OGG,
            MOV, AVI, MKV, MPEG, 3GP, and M4V.
          </p>

          <input
            ref={inputRef}
            accept={acceptedFileTypes}
            className="hidden"
            disabled={disabled}
            multiple
            onChange={handleFileSelection}
            type="file"
          />
        </div>
      </Card>

      <Card className="grid gap-4 p-4">
        <div className="space-y-1">
          <p className="font-medium text-foreground">Cloud pickers</p>
          <p className="text-sm text-muted-foreground">
            Browse Google Drive or Dropbox, then upload the selected assets into Ripples.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            disabled={
              disabled ||
              isUploading ||
              remainingSlots === 0 ||
              !googlePickerAvailability.configured
            }
            onClick={() => {
              void importFromGoogleDrive();
            }}
            type="button"
            variant="outline"
          >
            Browse Google Drive
          </Button>
          <Button
            disabled={
              disabled ||
              isUploading ||
              remainingSlots === 0 ||
              !dropboxPickerAvailability.configured
            }
            onClick={() => {
              void importFromDropbox();
            }}
            type="button"
            variant="outline"
          >
            Browse Dropbox
          </Button>
        </div>

        {googlePickerAvailability.configured && dropboxPickerAvailability.configured ? null : (
          <div className="grid gap-2 text-xs text-muted-foreground">
            {googlePickerAvailability.configured ? null : <p>{googlePickerAvailability.hint}</p>}
            {dropboxPickerAvailability.configured ? null : <p>{dropboxPickerAvailability.hint}</p>}
          </div>
        )}
      </Card>

      <Card className="grid gap-4 p-4">
        <div className="space-y-1">
          <p className="font-medium text-foreground">Import from shared links</p>
          <p className="text-sm text-muted-foreground">
            Add Dropbox or Google Drive media by pasting a public file link.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {externalProviders.map((provider) => (
            <Button
              className="h-auto justify-start px-4 py-3 text-left"
              disabled={disabled}
              key={provider.value}
              onClick={() => setExternalProvider(provider.value)}
              variant={externalProvider === provider.value ? 'default' : 'outline'}
            >
              <span className="block">
                <span className="block font-medium">{provider.label}</span>
                <span className="mt-1 block text-xs leading-5 opacity-80">
                  {provider.description}
                </span>
              </span>
            </Button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <Input
            aria-label="Media link"
            disabled={disabled}
            onChange={(event) => setExternalUrl(event.currentTarget.value)}
            placeholder={externalUrlPlaceholder}
            type="url"
            value={externalUrl}
          />
          <Input
            aria-label="Media alt text"
            disabled={disabled}
            onChange={(event) => setExternalAlt(event.currentTarget.value)}
            placeholder="Describe the media"
            value={externalAlt}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-muted-foreground" htmlFor="media-upload-type">
            Media type
          </label>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            disabled={disabled}
            id="media-upload-type"
            onChange={(event) => setExternalType(event.currentTarget.value as SupportedMediaType)}
            value={externalType}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <Button
            disabled={disabled || !externalUrl.trim() || remainingSlots === 0}
            onClick={addExternalMedia}
            type="button"
            variant="outline"
          >
            Add media link
          </Button>
        </div>
      </Card>

      {displayError ? (
        <p className="rounded-md border bg-muted px-3 py-2 text-sm text-destructive">
          {displayError}
        </p>
      ) : null}

      {value.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-5 text-sm text-muted-foreground">
          Add images or videos to preview the listing media.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {value.map((item) => (
            <Card className="grid gap-3 p-3" key={item.id}>
              <div className="overflow-hidden rounded-xl">
                <MediaRenderer
                  alt={item.alt}
                  className="aspect-[4/3] bg-muted"
                  mediaClassName="w-full"
                  muted
                  objectFit="cover"
                  showControls={item.type === 'video'}
                  source={{
                    mimeType: item.mimeType,
                    url: item.url,
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{item.type}</Badge>
                <Badge variant="secondary">{item.source}</Badge>
              </div>

              <Input
                aria-label={`Alt text for ${item.url}`}
                disabled={disabled}
                onChange={(event) => updateAlt(item.id, event.currentTarget.value)}
                placeholder="Describe this media"
                value={item.alt}
              />

              <div className="flex justify-end">
                <Button
                  disabled={disabled}
                  onClick={() => removeItem(item.id)}
                  type="button"
                  variant="outline"
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
