import type { Brand } from '@org/models';
import { useCallback, type KeyboardEvent } from 'react';
import BrandBadge from '../../badge/BrandBadge';
import { CarouselItem } from '../../ui/carousel';
import CarouselWrapper from '../carouselWrapper/CarouselWrapper';
import type { BadgeVariants, BrandsCarouselProps } from './types';

export function BrandsCarousel({
  brands,
  autoplay = true,
  autoplayDelay = 3000,
  stopOnInteraction = false,
  pauseOnHover = true,
  playOnHover = false,
  showNavigation = true,
  badgeVariant = BadgeVariants.SECONDARY,
  classes,
  onBrandClick,
  loop = true,
}: Readonly<BrandsCarouselProps>) {
  // Handle brand click - navigate or trigger callback
  const handleBrandClick = useCallback(
    (brand: Brand) => {
      onBrandClick?.(brand);
    },
    [onBrandClick]
  );

  // Handle keyboard navigation for accessibility
  const handleKeyDown = useCallback(
    (event: KeyboardEvent, brand: Brand) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleBrandClick(brand);
      }
    },
    [handleBrandClick]
  );

  return (
    <CarouselWrapper
      autoplay={autoplay}
      playOnHover={playOnHover}
      autoplayDelay={autoplayDelay}
      stopOnInteraction={stopOnInteraction}
      pauseOnHover={pauseOnHover}
      showNavigation={showNavigation}
      classes={classes}
      loop={loop}
    >
      {brands.map((brand) => (
        <CarouselItem key={brand.id} className="basis-auto pl-2 md:pl-4">
          <BrandBadge
            brand={brand}
            variant={badgeVariant}
            onClick={handleBrandClick}
            onKeyDown={handleKeyDown}
            clickable={!!onBrandClick}
          />
        </CarouselItem>
      ))}
    </CarouselWrapper>
  );
}

export default BrandsCarousel;
