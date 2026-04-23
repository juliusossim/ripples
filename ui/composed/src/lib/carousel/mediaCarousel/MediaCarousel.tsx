import type { MediaSource } from '@org/models';
import { Button } from '../../ui/button';
import { CarouselItem } from '../../ui/carousel';
import CarouselWrapper from '../carouselWrapper/CarouselWrapper';
import { MediaRenderer } from '../../media';

export interface MediaCarouselItem extends MediaSource {
  readonly alt?: string;
  readonly poster?: string;
}

export interface MediaCarouselProps {
  readonly items: readonly MediaCarouselItem[];
  readonly name: string;
  readonly onItemClick?: (args: {
    item: MediaCarouselItem;
    index: number;
  }) => void;
  readonly slideClassName?: string;
  readonly mediaClassName?: string;
  readonly buttonClassName?: string;
  readonly showNavigation?: boolean;
  readonly autoplay?: boolean;
  readonly loop?: boolean;
  readonly pauseOnHover?: boolean;
  readonly showControls?: boolean;
  readonly autoPlayVideo?: boolean;
}

export function MediaCarousel({
  items,
  name,
  onItemClick,
  slideClassName = 'h-50 lg:h-55 xl:h-60 2xl:h-72',
  mediaClassName = 'h-full w-full object-cover',
  buttonClassName = 'h-full w-full p-0',
  showNavigation = true,
  autoplay = false,
  loop = false,
  pauseOnHover = true,
  showControls = false,
  autoPlayVideo = false,
}: Readonly<MediaCarouselProps>) {
  if (!items.length) {
    return null;
  }

  return (
    <CarouselWrapper
      showNavigation={showNavigation}
      autoplay={autoplay}
      loop={loop}
      pauseOnHover={pauseOnHover}
      classes={{
        content: '!ml-0',
        prev: 'left-2',
        next: 'right-2',
      }}
    >
      {items.map((item, index) => {
        const slideLabel = `Open slide ${index + 1} of ${name}`;

        return (
          <CarouselItem
            key={`${item.url}-${index}`}
            className={`pl-0 ${slideClassName}`}
            aria-label={slideLabel}
          >
            {onItemClick ? (
              <Button
                onClick={() =>
                  onItemClick({
                    item,
                    index,
                  })
                }
                variant="ghost"
                className={buttonClassName}
                aria-label={slideLabel}
              >
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
              </Button>
            ) : (
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
            )}
          </CarouselItem>
        );
      })}
    </CarouselWrapper>
  );
}

export default MediaCarousel;