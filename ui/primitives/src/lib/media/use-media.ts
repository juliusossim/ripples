import { useCallback, useEffect, useRef, useState } from 'react';
import { detectMediaType } from './media.utils';
import type {
  MediaMetadata,
  MediaSource,
  UseMediaResult,
  VideoControls,
  VideoState,
} from './media.types';

type FullscreenVideoElement = HTMLVideoElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const initialVideoState: VideoState = {
  isPlaying: false,
  isPaused: true,
  isEnded: false,
  isMuted: false,
  isFullscreen: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  playbackRate: 1,
};

const initialMetadata: MediaMetadata = {
  type: 'unknown',
  width: null,
  height: null,
  duration: null,
  aspectRatio: null,
  isLoaded: false,
  isError: false,
  errorMessage: null,
};

function getAspectRatio(width: number, height: number): number | null {
  return width > 0 && height > 0 ? width / height : null;
}

function getBufferedPercent(video: HTMLVideoElement): number {
  if (video.buffered.length === 0 || !Number.isFinite(video.duration) || video.duration <= 0) {
    return 0;
  }

  const percent = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
  return Math.max(0, Math.min(100, percent));
}

export function useMedia(source: MediaSource): UseMediaResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [metadata, setMetadata] = useState<MediaMetadata>(() => ({
    ...initialMetadata,
    type: detectMediaType(source),
  }));
  const [videoState, setVideoState] = useState<VideoState | null>(() =>
    detectMediaType(source) === 'video' ? initialVideoState : null,
  );

  useEffect(() => {
    const type = detectMediaType(source);

    setMetadata({
      ...initialMetadata,
      type,
    });
    setVideoState(type === 'video' ? initialVideoState : null);
  }, [source]);

  const play = useCallback(async (): Promise<void> => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    await video.play();
  }, []);

  const pause = useCallback((): void => {
    videoRef.current?.pause();
  }, []);

  const toggle = useCallback(async (): Promise<void> => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      await play();
      return;
    }

    pause();
  }, [pause, play]);

  const seek = useCallback((time: number): void => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = Math.max(
      0,
      Math.min(time, Number.isFinite(video.duration) ? video.duration : 0),
    );
  }, []);

  const setVolume = useCallback((volume: number): void => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.volume = Math.max(0, Math.min(1, volume));
  }, []);

  const setMuted = useCallback((muted: boolean): void => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = muted;
  }, []);

  const setPlaybackRate = useCallback((rate: number): void => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.playbackRate = Math.max(0.25, Math.min(4, rate));
  }, []);

  const requestFullscreen = useCallback(async (): Promise<void> => {
    const video = videoRef.current as FullscreenVideoElement | null;
    if (!video) {
      return;
    }

    if (typeof video.requestFullscreen === 'function') {
      await video.requestFullscreen();
      return;
    }

    if (typeof video.webkitRequestFullscreen === 'function') {
      await video.webkitRequestFullscreen();
    }
  }, []);

  const controls: VideoControls | null =
    metadata.type === 'video'
      ? {
          play,
          pause,
          toggle,
          seek,
          setVolume,
          setMuted,
          setPlaybackRate,
          requestFullscreen,
        }
      : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || metadata.type !== 'video') {
      return;
    }

    const updateVideoState = (): void => {
      setVideoState({
        isPlaying: !video.paused && !video.ended,
        isPaused: video.paused,
        isEnded: video.ended,
        isMuted: video.muted,
        isFullscreen: document.fullscreenElement === video,
        currentTime: video.currentTime,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        buffered: getBufferedPercent(video),
        volume: video.volume,
        playbackRate: video.playbackRate,
      });
    };

    const handleLoadedMetadata = (): void => {
      setMetadata((previous) => ({
        ...previous,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: Number.isFinite(video.duration) ? video.duration : null,
        aspectRatio: getAspectRatio(video.videoWidth, video.videoHeight),
        isLoaded: true,
        isError: false,
        errorMessage: null,
      }));

      updateVideoState();
    };

    const handleError = (): void => {
      setMetadata((previous) => ({
        ...previous,
        isLoaded: false,
        isError: true,
        errorMessage: video.error?.message ?? 'Failed to load video',
      }));
    };

    const handleFullscreenChange = (): void => {
      setVideoState((previous) =>
        previous
          ? {
              ...previous,
              isFullscreen: document.fullscreenElement === video,
            }
          : null,
      );
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', updateVideoState);
    video.addEventListener('pause', updateVideoState);
    video.addEventListener('ended', updateVideoState);
    video.addEventListener('timeupdate', updateVideoState);
    video.addEventListener('volumechange', updateVideoState);
    video.addEventListener('ratechange', updateVideoState);
    video.addEventListener('progress', updateVideoState);
    video.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', updateVideoState);
      video.removeEventListener('pause', updateVideoState);
      video.removeEventListener('ended', updateVideoState);
      video.removeEventListener('timeupdate', updateVideoState);
      video.removeEventListener('volumechange', updateVideoState);
      video.removeEventListener('ratechange', updateVideoState);
      video.removeEventListener('progress', updateVideoState);
      video.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [metadata.type]);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || metadata.type !== 'image') {
      return;
    }

    const handleLoad = (): void => {
      setMetadata((previous) => ({
        ...previous,
        width: image.naturalWidth,
        height: image.naturalHeight,
        aspectRatio: getAspectRatio(image.naturalWidth, image.naturalHeight),
        isLoaded: true,
        isError: false,
        errorMessage: null,
      }));
    };

    const handleError = (): void => {
      setMetadata((previous) => ({
        ...previous,
        isLoaded: false,
        isError: true,
        errorMessage: 'Failed to load image',
      }));
    };

    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);

    if (image.complete && image.naturalWidth > 0) {
      handleLoad();
    }

    return () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };
  }, [metadata.type]);

  return {
    metadata,
    videoState,
    controls,
    videoRef,
    imageRef,
  };
}
