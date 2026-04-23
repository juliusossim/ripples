import type { MediaRendererProps } from '@org/models';
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { formatVideoTime, useMedia } from '../hooks';
import { cn } from '../utils';

export type { MediaRendererProps };

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
}: Readonly<MediaRendererProps>) {
  const { metadata, videoState, controls, videoRef, imageRef } =
    useMedia(source);
  const [showVideoControls, setShowVideoControls] = useState(false);

  // Determine muted state (default to true if autoPlay is enabled)
  const isMuted = muted ?? autoPlay;

  const handleMouseEnter = useCallback(() => setShowVideoControls(true), []);
  const handleMouseLeave = useCallback(() => setShowVideoControls(false), []);

  // Handle load/error callbacks
  useEffect(() => {
    if (metadata.isLoaded && onLoad) {
      onLoad();
    }
  }, [metadata.isLoaded, onLoad]);

  useEffect(() => {
    if (metadata.isError && metadata.errorMessage && onError) {
      onError(metadata.errorMessage);
    }
  }, [metadata.isError, metadata.errorMessage, onError]);

  const objectFitClass = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }[objectFit];

  // Render image
  if (metadata.type === 'image') {
    return (
      <div className={cn('relative', className)}>
        <img
          ref={imageRef}
          src={source.url}
          alt={alt}
          className={cn('w-full h-full', objectFitClass, mediaClassName)}
          loading="lazy"
        />
        {metadata.isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">
              Failed to load image
            </span>
          </div>
        )}
      </div>
    );
  }

  // Render video
  if (metadata.type === 'video') {
    return (
      <section
        className={cn('relative group', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`Video: ${alt}`}
      >
        <video
          ref={videoRef}
          src={source.url}
          aria-label={alt}
          className={cn('w-full h-full', objectFitClass, mediaClassName)}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          poster={poster}
          onClick={() => controls?.toggle()}
        >
          <track
            kind="captions"
            src={captionTrack ?? ''}
            label="Captions"
            default={Boolean(captionTrack)}
          />
        </video>

        {/* Custom Video Controls Overlay */}
        {showControls && videoState && controls && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 transition-opacity duration-200',
              showVideoControls || videoState.isPaused
                ? 'opacity-100'
                : 'opacity-0'
            )}
          >
            {/* Progress Bar */}
            <div className="mb-2">
              <input
                type="range"
                min={0}
                max={videoState.duration || 100}
                value={videoState.currentTime}
                onChange={(e) => controls.seek(Number(e.target.value))}
                className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    controls.toggle();
                  }}
                  className="hover:scale-110 transition-transform"
                  aria-label={videoState.isPlaying ? 'Pause' : 'Play'}
                >
                  {videoState.isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Volume Control */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    controls.setMuted(!videoState.isMuted);
                  }}
                  className="hover:scale-110 transition-transform"
                  aria-label={videoState.isMuted ? 'Unmute' : 'Mute'}
                >
                  {videoState.isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                {/* Time Display */}
                <span className="text-xs tabular-nums">
                  {formatVideoTime(videoState.currentTime)} /{' '}
                  {formatVideoTime(videoState.duration)}
                </span>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  controls.requestFullscreen();
                }}
                className="hover:scale-110 transition-transform"
                aria-label="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Play Button Overlay (when paused) */}
        {videoState?.isPaused && !videoState.isEnded && (
          <button
            onClick={() => controls?.play()}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Play video"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-8 h-8 text-black ml-1" />
            </div>
          </button>
        )}

        {metadata.isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">
              Failed to load video
            </span>
          </div>
        )}
      </section>
    );
  }

  // Unknown media type - try as image
  return (
    <div className={cn('relative', className)}>
      <img
        ref={imageRef}
        src={source.url}
        alt={alt}
        className={cn('w-full h-full', objectFitClass, mediaClassName)}
        loading="lazy"
      />
    </div>
  );
}
