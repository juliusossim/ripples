import type { Brand } from '@org/models';
import { CarouselWrapperClasses } from '../carouselWrapper/types';

export interface BrandsCarouselProps {
  /** Array of brands to display */
  brands: Brand[];
  /** Enable autoplay (default: true) */
  autoplay?: boolean;
  /** Start autoplay only while hovered, typically with autoplay={false}. */
  playOnHover?: boolean;
  /** Autoplay delay in milliseconds (default: 3000) */
  autoplayDelay?: number;
  /** Stop autoplay when user interacts (default: false) */
  stopOnInteraction?: boolean;
  /** Pause autoplay on mouse hover (default: true) */
  pauseOnHover?: boolean;
  /** Show navigation arrows (default: true) */
  showNavigation?: boolean;
  /** Badge variant for brand items */
  badgeVariant?: BadgeVariant;
  /** Additional class names for the carousel elements */
  classes?: Partial<CarouselWrapperClasses>;
  /** Callback when a brand is clicked */
  onBrandClick?: (brand: Brand) => void;
  /** Enable infinite loop (default: true) */
  loop?: boolean;
}
export const BadgeVariants = {
  DEFAULT: 'default',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
} as const;
export type BadgeVariant = (typeof BadgeVariants)[keyof typeof BadgeVariants];
