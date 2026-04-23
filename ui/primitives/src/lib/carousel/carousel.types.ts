import type { ComponentPropsWithoutRef, KeyboardEvent } from 'react';
import type useEmblaCarousel from 'embla-carousel-react';
import type { ButtonProps } from '../button';

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;

export type CarouselApi = ReturnType<typeof useEmblaCarousel>[1];
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export type CarouselProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
  }
>;

export type CarouselContextProps = Readonly<{
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
}>;

export type CarouselContentProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type CarouselItemProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type CarouselControlProps = Readonly<ButtonProps>;
export type CarouselKeyDownEvent = KeyboardEvent<HTMLDivElement>;
