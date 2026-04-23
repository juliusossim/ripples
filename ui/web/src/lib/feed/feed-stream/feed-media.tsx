import { useEffect, useRef, type ReactElement } from 'react';
import type { FeedStreamItem } from '../feed-utils/feed.utils';

export interface FeedMediaProps {
  readonly media: FeedStreamItem['mediaItems'][number];
  readonly mediaKey: string;
  readonly title: string;
}

export function FeedMedia({ media, mediaKey, title }: Readonly<FeedMediaProps>): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (media.type !== 'video') {
      return undefined;
    }

    const element = containerRef.current;
    const video = videoRef.current;
    if (!element || !video || typeof IntersectionObserver !== 'function') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio > 0.65) {
          void video.play().catch(() => undefined);
          return;
        }

        video.pause();
      },
      { threshold: [0.2, 0.65, 0.9] },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [media.type, mediaKey]);

  let mediaContent: ReactElement;
  if (media.type === 'video') {
    mediaContent = (
      <video
        className="aspect-[4/5] w-full object-cover"
        loop
        muted
        playsInline
        poster={media.poster}
        preload="metadata"
        ref={videoRef}
      >
        <source src={media.url} type="video/mp4" />
      </video>
    );
  } else if (media.url) {
    mediaContent = (
      <img
        alt={media.alt}
        className="aspect-[4/5] w-full object-cover"
        loading="lazy"
        src={media.url}
      />
    );
  } else {
    mediaContent = (
      <div className="flex aspect-[4/5] items-center justify-center bg-slate-900 px-6 text-center text-sm text-white/58">
        {title} has no media yet.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950" ref={containerRef}>
      {mediaContent}
    </div>
  );
}
