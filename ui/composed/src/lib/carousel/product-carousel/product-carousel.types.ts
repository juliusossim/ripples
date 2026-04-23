import type { ReactElement } from 'react';
import type {
  MediaCarouselClickArgs,
  MediaCarouselItem,
} from '../media-carousel';

export type ProductCarouselProduct = Readonly<{
  id: string;
  name: string;
  media?: readonly MediaCarouselItem[];
  imageUrls?: readonly string[];
}>;

export type ProductCarouselProps = Readonly<{
  product: ProductCarouselProduct;
  onImageClick?: (args: { url: string; index: number }) => void;
  children?: ReactElement;
  className?: string;
  contentClassName?: string;
  slideClassName?: string;
  mediaClassName?: string;
  showNavigation?: boolean;
  showIndicators?: boolean;
}>;

export type ProductCarouselClickArgs = Readonly<MediaCarouselClickArgs>;
