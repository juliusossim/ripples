import type { MediaCarouselItem } from '../mediaCarousel/MediaCarousel';
import { MediaCarousel } from '../mediaCarousel/MediaCarousel';

export type PropertyMediaItem = MediaCarouselItem;

export interface PropertyCarouselItem {
  readonly id: string;
  readonly title: string;
  readonly image?: string;
  readonly media?: readonly PropertyMediaItem[];
}

export interface PropertyCarouselProps {
  readonly listing: PropertyCarouselItem;
  readonly onMediaClick?: (args: {
    item: PropertyMediaItem;
    index: number;
  }) => void;
  readonly slideClassName?: string;
  readonly mediaClassName?: string;
  readonly showNavigation?: boolean;
}

function normalizeListingMedia(
  listing: PropertyCarouselItem
): PropertyMediaItem[] {
  if (listing.media?.length) {
    return [...listing.media];
  }

  if (listing.image) {
    return [{ url: listing.image, alt: listing.title }];
  }

  return [];
}

export function PropertyCarousel({
  listing,
  onMediaClick,
  slideClassName = 'h-64 sm:h-72',
  mediaClassName = 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
  showNavigation = true,
}: Readonly<PropertyCarouselProps>) {
  const items = normalizeListingMedia(listing);

  return (
    <MediaCarousel
      items={items}
      name={listing.title}
      onItemClick={onMediaClick}
      slideClassName={slideClassName}
      mediaClassName={mediaClassName}
      showNavigation={showNavigation && items.length > 1}
    />
  );
}

export default PropertyCarousel;
