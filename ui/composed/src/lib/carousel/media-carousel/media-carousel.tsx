import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  MediaRenderer,
  cn,
  type CarouselApi,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { MediaCarouselItem, MediaCarouselProps } from './media-carousel.types';

function getMediaItemKey(item: MediaCarouselItem, index: number): string {
  return item.id ?? `${item.url}-${index}`;
}

export function MediaCarousel({
  items,
  name,
  className,
  contentClassName,
  slideClassName = 'h-64 sm:h-72',
  mediaClassName = 'h-full w-full object-cover',
  buttonClassName = 'h-full w-full p-0',
  showNavigation = true,
  showIndicators = true,
  showControls = false,
  autoPlayVideo = false,
  carouselOpts,
  onApiChange,
  onItemClick,
}: Readonly<MediaCarouselProps>): ReactElement | null {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    onApiChange?.(api);
  }, [api, onApiChange]);

  useEffect(() => {
    if (!api) {
      setActiveIndex(0);
      return;
    }

    const updateActiveIndex = (): void => {
      setActiveIndex(api.selectedScrollSnap());
    };

    updateActiveIndex();
    api.on('select', updateActiveIndex);
    api.on('reInit', updateActiveIndex);

    return () => {
      api.off('select', updateActiveIndex);
      api.off('reInit', updateActiveIndex);
    };
  }, [api]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative', className)}>
      <Carousel className="w-full" opts={carouselOpts} setApi={setApi}>
        <CarouselContent className={cn('-ml-0', contentClassName)}>
          {items.map((item, index) => {
            const slideLabel = `Open slide ${index + 1} of ${name}`;
            const media = (
              <MediaRenderer
                source={{ url: item.url, mimeType: item.mimeType }}
                alt={item.alt ?? name}
                className="h-full w-full"
                mediaClassName={mediaClassName}
                poster={item.poster}
                showControls={showControls}
                autoPlay={autoPlayVideo}
                loop={autoPlayVideo}
              />
            );

            return (
              <CarouselItem
                key={getMediaItemKey(item, index)}
                aria-label={slideLabel}
                className={cn('pl-0', slideClassName)}
              >
                {onItemClick ? (
                  <Button
                    type="button"
                    aria-label={slideLabel}
                    className={buttonClassName}
                    onClick={() => onItemClick({ item, index })}
                    variant="ghost"
                  >
                    {media}
                  </Button>
                ) : (
                  <div className="h-full w-full">{media}</div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {showNavigation && items.length > 1 ? (
          <>
            <CarouselPrevious className="left-3 border-white/16 bg-slate-950/55 text-white hover:bg-slate-950/70 hover:text-white" />
            <CarouselNext className="right-3 border-white/16 bg-slate-950/55 text-white hover:bg-slate-950/70 hover:text-white" />
          </>
        ) : null}
      </Carousel>

      {showIndicators && items.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {items.map((item, index) => (
            <button
              key={`${getMediaItemKey(item, index)}-indicator`}
              type="button"
              aria-label={`Show slide ${index + 1} for ${name}`}
              className={cn(
                'h-2.5 w-2.5 rounded-full border border-white/30 transition-colors',
                index === activeIndex ? 'bg-white' : 'bg-white/30',
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
