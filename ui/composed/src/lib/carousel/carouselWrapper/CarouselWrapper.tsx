import Autoplay from 'embla-carousel-autoplay';

import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/carousel';
import { cn } from '../../utils';
import { CarouselWrapperProps } from './types';

// ============================================================================
// Component
// ============================================================================

/**
 * CarouselWrapper - A flexible carousel wrapper component
 *
 * @example
 * ```tsx
 * const brands = [
 *   { id: '1', name: 'Nike' },
 *   { id: '2', name: 'Adidas' },
 *   { id: '3', name: 'Puma' },
 * ];
 *
 * <CarouselWrapper
 *   autoplayDelay={3000}
 *   pauseOnHover
 * >
 *   {brands.map((brand) => (
 *     <BrandBadge key={brand.id} brand={brand} />
 *   ))}
 * </CarouselWrapper>
 * ```
 */
export function CarouselWrapper({
  children,
  autoplayDelay = 3000,
  dragFree = true,
  stopOnInteraction = false,
  pauseOnHover = true,
  showNavigation = true,
  classes,
  loop = true,
  orientation = 'horizontal',
  autoplay = true,
  playOnHover = false,
}: Readonly<CarouselWrapperProps>) {
  const shouldUseAutoplayPlugin = autoplay || playOnHover;
  const shouldPauseRunningAutoplayOnHover = autoplay && pauseOnHover;
  const shouldPlayOnlyWhileHovered = !autoplay && playOnHover;

  // Create autoplay plugin with a ref to maintain instance across renders
  const autoplayPlugin = useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction,
      stopOnMouseEnter: shouldPauseRunningAutoplayOnHover,
      playOnInit: autoplay,
    })
  );

  if (!children) {
    return null;
  }

  const handleMouseEnter = () => {
    if (shouldPauseRunningAutoplayOnHover) {
      autoplayPlugin.current.stop();
    }

    if (shouldPlayOnlyWhileHovered) {
      autoplayPlugin.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (shouldPlayOnlyWhileHovered) {
      autoplayPlugin.current.stop();
      return;
    }

    if (shouldPauseRunningAutoplayOnHover) {
      autoplayPlugin.current.play();
    }
  };

  return (
    <Carousel
      opts={{
        align: 'start',
        loop,
        dragFree,
      }}
      plugins={shouldUseAutoplayPlugin ? [autoplayPlugin.current] : []}
      className={cn(
        'group w-full',
        classes?.wrapper,
        orientation === 'vertical' &&
          '**:data-[slot=carousel-content]:h-full [&_[data-slot=carousel-content]>div]:h-full'
      )}
      onMouseEnter={shouldUseAutoplayPlugin ? handleMouseEnter : undefined}
      onMouseLeave={shouldUseAutoplayPlugin ? handleMouseLeave : undefined}
      orientation={orientation}
    >
      <CarouselContent
        className={cn('-ml-2 md:-ml-4 items-center', classes?.content)}
      >
        {children}
      </CarouselContent>

      {showNavigation && (
        <>
          <CarouselPrevious
            className={cn(
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100',
              classes?.prev
            )}
          />
          <CarouselNext
            className={cn(
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100',
              classes?.next
            )}
          />
        </>
      )}
    </Carousel>
  );
}

export default CarouselWrapper;
