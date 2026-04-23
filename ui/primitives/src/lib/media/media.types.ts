import type { RefObject } from 'react';

export type MediaType = 'image' | 'video' | 'unknown';

export interface MediaSource {
  readonly url: string;
  readonly mimeType?: string;
}

export interface MediaMetadata {
  readonly type: MediaType;
  readonly width: number | null;
  readonly height: number | null;
  readonly duration: number | null;
  readonly aspectRatio: number | null;
  readonly isLoaded: boolean;
  readonly isError: boolean;
  readonly errorMessage: string | null;
}

export interface VideoControls {
  readonly play: () => Promise<void>;
  readonly pause: () => void;
  readonly toggle: () => Promise<void>;
  readonly seek: (time: number) => void;
  readonly setVolume: (volume: number) => void;
  readonly setMuted: (muted: boolean) => void;
  readonly setPlaybackRate: (rate: number) => void;
  readonly requestFullscreen: () => Promise<void>;
}

export interface VideoState {
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
  readonly isEnded: boolean;
  readonly isMuted: boolean;
  readonly isFullscreen: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly buffered: number;
  readonly volume: number;
  readonly playbackRate: number;
}

export interface UseMediaResult {
  readonly metadata: MediaMetadata;
  readonly videoState: VideoState | null;
  readonly controls: VideoControls | null;
  readonly videoRef: RefObject<HTMLVideoElement | null>;
  readonly imageRef: RefObject<HTMLImageElement | null>;
}

export interface MediaRendererProps {
  readonly source: MediaSource;
  readonly alt: string;
  readonly className?: string;
  readonly mediaClassName?: string;
  readonly autoPlay?: boolean;
  readonly loop?: boolean;
  readonly muted?: boolean;
  readonly showControls?: boolean;
  readonly poster?: string;
  readonly onLoad?: () => void;
  readonly onError?: (error: string) => void;
  readonly objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  readonly captionTrack?: string;
}
