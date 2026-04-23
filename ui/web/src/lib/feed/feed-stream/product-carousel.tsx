import { Badge, Button, cn } from '@org/ui-primitives';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { FeedMedia } from './feed-media';
import type { FeedStreamItem } from '../feed-utils/feed.utils';

export interface ProductCarouselProps {
  readonly item: FeedStreamItem;
  readonly isLiked: boolean;
  readonly onDoubleLike: () => void;
  readonly onToggleLike: () => void;
}

export function ProductCarousel({
  item,
  isLiked,
  onDoubleLike,
  onToggleLike,
}: Readonly<ProductCarouselProps>): ReactElement {
  const lastTapRef = useRef(0);
  const burstTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const activeMedia = item.mediaItems[activeMediaIndex] ?? item.mediaItems[0];

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [item.id]);

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current !== undefined) {
        globalThis.clearTimeout(burstTimeoutRef.current);
      }
    };
  }, []);

  function triggerLikeBurst(): void {
    onDoubleLike();
    setShowBurst(true);

    if (burstTimeoutRef.current !== undefined) {
      globalThis.clearTimeout(burstTimeoutRef.current);
    }

    burstTimeoutRef.current = globalThis.setTimeout(() => {
      setShowBurst(false);
    }, 650);
  }

  function handleTouchEnd(): void {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      triggerLikeBurst();
    }

    lastTapRef.current = now;
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950">
      <FeedMedia
        media={activeMedia}
        mediaKey={`${item.id}-${activeMediaIndex}`}
        title={item.title}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,24,0.15)_0%,rgba(3,10,24,0)_38%,rgba(3,10,24,0.84)_100%)]" />

      <button
        aria-label={`Like ${item.title} by double tap or double click`}
        className="absolute inset-0 z-0 cursor-pointer bg-transparent"
        onDoubleClick={triggerLikeBurst}
        onTouchEnd={handleTouchEnd}
        type="button"
      />

      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <Badge className="rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-xl">
          {item.surfaceLabel}
        </Badge>
        <Badge className="rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-xl">
          {item.primaryReason}
        </Badge>
        <Badge className="rounded-full bg-slate-950/55 px-3 py-1 text-[11px] text-white backdrop-blur-xl">
          {item.statusLabel}
        </Badge>
        {activeMedia?.type === 'video' ? (
          <Badge className="rounded-full bg-emerald-500/18 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-200">
            Video
          </Badge>
        ) : null}
      </div>

      <div className="absolute right-4 top-4 z-20">
        <Button
          aria-label={isLiked ? `Unlike ${item.title}` : `Like ${item.title}`}
          className="h-11 w-11 rounded-full border border-white/16 bg-slate-950/55 p-0 text-white backdrop-blur-xl hover:bg-slate-950/70"
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike();
          }}
          size="sm"
          variant="outline"
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              isLiked ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-white',
            )}
          />
        </Button>
      </div>

      {item.mediaItems.length > 1 ? (
        <>
          <Button
            aria-label={`Show previous image for ${item.title}`}
            className="absolute left-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/55 p-0 text-white backdrop-blur-xl hover:bg-slate-950/70"
            onClick={(event) => {
              event.stopPropagation();
              setActiveMediaIndex((current) =>
                current === 0 ? item.mediaItems.length - 1 : current - 1,
              );
            }}
            size="sm"
            variant="outline"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            aria-label={`Show next image for ${item.title}`}
            className="absolute right-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/55 p-0 text-white backdrop-blur-xl hover:bg-slate-950/70"
            onClick={(event) => {
              event.stopPropagation();
              setActiveMediaIndex((current) =>
                current === item.mediaItems.length - 1 ? 0 : current + 1,
              );
            }}
            size="sm"
            variant="outline"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {item.mediaItems.map((media, index) => (
              <button
                aria-label={`Show media ${index + 1} for ${item.title}`}
                className={cn(
                  'h-2.5 w-2.5 rounded-full border border-white/30 transition-colors',
                  index === activeMediaIndex ? 'bg-white' : 'bg-white/30',
                )}
                key={`${media.type}-${media.url}-${media.alt || item.id}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveMediaIndex(index);
                }}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}

      {showBurst ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="absolute h-28 w-28 animate-ping rounded-full bg-white/10" />
          <div className="rounded-full border border-white/18 bg-white/14 px-5 py-4 text-sm font-semibold text-white backdrop-blur-xl">
            Liked
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-5">
        <div className="space-y-3">
          {item.priceLabel || item.locationLabel ? (
            <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs text-white/82 backdrop-blur-xl">
              {item.priceLabel ? (
                <span className="font-semibold text-amber-200">{item.priceLabel}</span>
              ) : null}
              {item.locationLabel ? <span>{item.locationLabel}</span> : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {item.reasonBadges.map((badge) => (
              <span
                className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/74 backdrop-blur-xl"
                key={badge}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div
          className={cn(
            'rounded-full border border-white/14 bg-slate-950/55 px-3 py-2 text-xs text-white/80 backdrop-blur-xl',
            activeMedia?.type === 'video' ? 'block' : 'hidden sm:block',
          )}
        >
          Double tap to like
        </div>
      </div>
    </div>
  );
}
