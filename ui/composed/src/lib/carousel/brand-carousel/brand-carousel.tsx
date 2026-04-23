import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  cn,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { BrandBadge } from '../../badge';
import type { BrandCarouselProps } from './brand-carousel.types';

export function BrandCarousel({
  brands,
  className,
  contentClassName,
  itemClassName,
  showNavigation = false,
  badgeVariant = 'outline',
  onBrandClick,
}: Readonly<BrandCarouselProps>): ReactElement | null {
  if (brands.length === 0) {
    return null;
  }

  return (
    <Carousel className={cn('group w-full', className)} opts={{ align: 'start', dragFree: true, loop: false }}>
      <CarouselContent className={cn('-ml-2 items-center', contentClassName)}>
        {brands.map((brand) => (
          <CarouselItem key={brand.id} className={cn('basis-auto pl-2', itemClassName)}>
            <BrandBadge
              brand={brand}
              clickable={Boolean(onBrandClick)}
              onClick={onBrandClick}
              variant={badgeVariant}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {showNavigation ? (
        <>
          <CarouselPrevious className="left-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80 hover:text-white" />
          <CarouselNext className="right-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80 hover:text-white" />
        </>
      ) : null}
    </Carousel>
  );
}
