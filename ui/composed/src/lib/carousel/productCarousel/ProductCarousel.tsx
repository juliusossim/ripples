import type { Product } from '@org/models';
import type { PropsWithChildren } from 'react';
import { MediaCarousel } from '../mediaCarousel/MediaCarousel';

export interface ProductCarouselProps extends PropsWithChildren {
  readonly product: Product;
  readonly onImageClick?: (args: { url: string; index: number }) => void;
}

export function ProductCarousel({
  product,
  onImageClick,
  children,
}: Readonly<ProductCarouselProps>) {
  const items = product.imageUrls.map((url) => ({
    url,
    alt: product.name,
  }));

  return (
    children ?? (
      <MediaCarousel
        items={items}
        name={product.name}
        onItemClick={
          onImageClick
            ? ({ item, index }) =>
                onImageClick({
                  url: item.url,
                  index,
                })
            : undefined
        }
      />
    )
  );
}
