import type { BadgeVariant } from '@org/ui-primitives';
import type { BrandBadgeItem } from '../../badge';

export type BrandCarouselProps = Readonly<{
  brands: readonly BrandBadgeItem[];
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  showNavigation?: boolean;
  badgeVariant?: BadgeVariant;
  onBrandClick?: (brand: BrandBadgeItem) => void;
}>;
