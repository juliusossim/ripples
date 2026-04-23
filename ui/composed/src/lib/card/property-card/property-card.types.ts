import type { AmountProps } from '../../amount';
import type { BrandBadgeItem } from '../../badge';
import type { PropertyCarouselClickArgs, PropertyCarouselItem } from '../../carousel';

export type PropertyCardStat = Readonly<{
  label: string;
  value: string;
}>;

export type PropertyStructuredStats = Readonly<{
  beds?: number;
  baths?: number;
  area?: string;
}>;

export type PropertyCardItem = Readonly<
  PropertyCarouselItem & {
    priceLabel?: string;
    amount?: AmountProps;
    locationLabel: string;
    description?: string;
    statusLabel?: string;
    badges?: readonly string[];
    tags?: readonly string[];
    tagBrands?: readonly BrandBadgeItem[];
    propertyStats?: PropertyStructuredStats;
    stats?: readonly PropertyCardStat[];
    primaryActionLabel?: string;
  }
>;

export type PropertyCardSettings = Readonly<{
  highlight?: boolean;
  showBadges?: boolean;
  showTags?: boolean;
  showStats?: boolean;
  showSaveButton?: boolean;
  showPrimaryAction?: boolean;
  showCarouselNavigation?: boolean;
  showCarouselIndicators?: boolean;
  className?: string;
}>;

export type PropertyCardProps = Readonly<{
  listing: PropertyCardItem;
  settings?: PropertyCardSettings;
  isSaved?: boolean;
  onSave?: (listing: PropertyCardItem) => void;
  onPrimaryAction?: (listing: PropertyCardItem) => void;
  onMediaClick?: (args: PropertyCarouselClickArgs) => void;
}>;
