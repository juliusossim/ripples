import type { CarouselApi, CarouselOptions, MediaSource } from '@org/ui-primitives';

export type MediaCarouselItem = Readonly<
  MediaSource & {
    id?: string;
    alt?: string;
    poster?: string;
  }
>;

export type MediaCarouselClickArgs = Readonly<{
  item: MediaCarouselItem;
  index: number;
}>;

export type MediaCarouselProps = Readonly<{
  items: readonly MediaCarouselItem[];
  name: string;
  className?: string;
  contentClassName?: string;
  slideClassName?: string;
  mediaClassName?: string;
  buttonClassName?: string;
  showNavigation?: boolean;
  showIndicators?: boolean;
  showControls?: boolean;
  autoPlayVideo?: boolean;
  carouselOpts?: CarouselOptions;
  onApiChange?: (api: CarouselApi | undefined) => void;
  onItemClick?: (args: MediaCarouselClickArgs) => void;
}>;
