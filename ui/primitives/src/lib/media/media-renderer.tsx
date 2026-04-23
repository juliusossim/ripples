import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback, useEffect } from 'react';
import { cn } from '../utils';
import { formatVideoTime } from './media.utils';
import { useMedia } from './use-media';
import type { MediaRendererProps } from './media.types';

const emptyCaptionTrackDataUrl = 'data:text/vtt;charset=utf-8,WEBVTT';

const objectFitClassNames: Record<NonNullable<MediaRendererProps['objectFit']>, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

function MediaErrorOverlay({ message }: Readonly<{ message: string }>): ReactElement {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/90 p-4">
      <span className="text-center text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

export function MediaRenderer({
  source,
  alt,
  className,
  mediaClassName,
  autoPlay = false,
  loop = false,
  muted,
  showControls = true,
  poster,
  onLoad,
  onError,
  objectFit = 'cover',
  captionTrack,
}: Readonly<MediaRendererProps>): ReactElement {
  const { metadata, videoState, controls, videoRef, imageRef } = useMedia(source);

  const isMuted = muted ?? autoPlay;
  const objectFitClassName = objectFitClassNames[objectFit];

  useEffect(() => {
    if (metadata.isLoaded) {
      onLoad?.();
    }
  }, [metadata.isLoaded, onLoad]);

  useEffect(() => {
    if (metadata.isError && metadata.errorMessage) {
      onError?.(metadata.errorMessage);
    }
  }, [metadata.errorMessage, metadata.isError, onError]);

  const handleVideoToggle = useCallback(
    async (event?: MouseEvent<HTMLElement>): Promise<void> => {
      event?.stopPropagation();
      await controls?.toggle();
    },
    [controls],
  );

  const handlePlay = useCallback(
    async (event: MouseEvent<HTMLElement>): Promise<void> => {
      event.stopPropagation();
      await controls?.play();
    },
    [controls],
  );

  const handleMuteToggle = useCallback(
    (event: MouseEvent<HTMLElement>): void => {
      event.stopPropagation();
      controls?.setMuted(!(videoState?.isMuted ?? false));
    },
    [controls, videoState?.isMuted],
  );

  const handleFullscreen = useCallback(
    async (event: MouseEvent<HTMLElement>): Promise<void> => {
      event.stopPropagation();
      await controls?.requestFullscreen();
    },
    [controls],
  );

  if (metadata.type === 'image') {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <img
          ref={imageRef}
          src={source.url}
          alt={alt}
          className={cn('h-full w-full', objectFitClassName, mediaClassName)}
          loading="lazy"
        />
        {metadata.isError ? <MediaErrorOverlay message="Failed to load image" /> : null}
      </div>
    );
  }

  if (metadata.type === 'video') {
    return (
      <section
        className={cn('group relative overflow-hidden', className)}
        aria-label={`Video: ${alt}`}
      >
        <video
          ref={videoRef}
          src={source.url}
          aria-label={alt}
          className={cn('h-full w-full', objectFitClassName, mediaClassName)}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          poster={poster}
          onClick={handleVideoToggle}
        >
          <track
            kind="captions"
            src={captionTrack ?? emptyCaptionTrackDataUrl}
            label={captionTrack ? 'Captions' : 'Captions unavailable'}
            default
          />
        </video>

        {showControls && videoState && controls ? (
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/35 to-transparent p-4 transition-opacity duration-200',
              videoState.isPaused
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
            )}
          >
            <div className="mb-3">
              <input
                aria-label="Seek video"
                type="range"
                min={0}
                max={videoState.duration || 100}
                value={Math.min(videoState.currentTime, videoState.duration || 100)}
                onChange={(event) => controls.seek(Number(event.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleVideoToggle}
                  className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  aria-label={videoState.isPlaying ? 'Pause' : 'Play'}
                >
                  {videoState.isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleMuteToggle}
                  className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  aria-label={videoState.isMuted ? 'Unmute' : 'Mute'}
                >
                  {videoState.isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>

                <span className="text-xs tabular-nums">
                  {formatVideoTime(videoState.currentTime)} / {formatVideoTime(videoState.duration)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleFullscreen}
                className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                aria-label="Fullscreen"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : null}

        {videoState?.isPaused && !videoState.isEnded ? (
          <button
            type="button"
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            aria-label="Play video"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black">
              <Play className="ml-1 h-8 w-8" />
            </span>
          </button>
        ) : null}

        {metadata.isError ? <MediaErrorOverlay message="Failed to load video" /> : null}
      </section>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        ref={imageRef}
        src={source.url}
        alt={alt}
        className={cn('h-full w-full', objectFitClassName, mediaClassName)}
        loading="lazy"
      />
    </div>
  );
}
