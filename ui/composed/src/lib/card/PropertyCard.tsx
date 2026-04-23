import type { Brand } from '@org/models';
import { Bath, BedDouble, Heart, MapPin, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BrandsCarousel } from '../carousel/brandCarousel/BrandsCarousel';
import { BadgeVariants } from '../carousel/brandCarousel/types';
import {
  PropertyCarousel,
  type PropertyCarouselItem,
  type PropertyMediaItem,
} from '../carousel/propertyCarousel/PropertyCarousel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '../utils';

export interface PropertyCardItem extends PropertyCarouselItem {
  readonly price: string;
  readonly location: string;
  readonly tags: readonly string[];
  readonly badges: readonly string[];
  readonly stats: {
    readonly beds?: number;
    readonly baths?: number;
    readonly area: string;
  };
}

export interface PropertyCardSettings {
  readonly highlight?: boolean;
  readonly showBadges?: boolean;
  readonly showTags?: boolean;
  readonly showStats?: boolean;
  readonly showSaveButton?: boolean;
  readonly showCarouselNavigation?: boolean;
  readonly className?: string;
}

const defaultSettings: PropertyCardSettings = {
  highlight: false,
  showBadges: true,
  showTags: true,
  showStats: true,
  showSaveButton: true,
  showCarouselNavigation: true,
};

export interface PropertyCardProps {
  readonly listing: PropertyCardItem;
  readonly settings?: PropertyCardSettings;
  readonly onSave?: (listing: PropertyCardItem) => void;
  readonly onMediaClick?: (args: {
    item: PropertyMediaItem;
    index: number;
  }) => void;
}

export function PropertyCard({
  listing,
  settings = defaultSettings,
  onSave,
  onMediaClick,
}: Readonly<PropertyCardProps>) {
  const resolvedSettings = {
    ...defaultSettings,
    ...settings,
  };
  const tagCarouselRef = useRef<HTMLDivElement>(null);
  const [shouldScrollTagCarousel, setShouldScrollTagCarousel] = useState(false);
  const tagBrands: Brand[] = listing.tags.map((tag) => ({
    id: `${listing.id}-${tag}`,
    name: tag,
    className: 'text-white/78',
  }));

  useEffect(() => {
    const container = tagCarouselRef.current;

    if (!container) {
      return;
    }

    const measureOverflow = () => {
      const viewport = container.querySelector<HTMLElement>(
        '[data-slot="carousel-content"]'
      );
      const content = viewport?.firstElementChild as HTMLElement | null;

      if (!viewport || !content) {
        setShouldScrollTagCarousel(false);
        return;
      }

      setShouldScrollTagCarousel(
        content.scrollWidth > viewport.clientWidth + 1
      );
    };

    measureOverflow();

    const resizeObserver = new ResizeObserver(() => {
      measureOverflow();
    });

    resizeObserver.observe(container);

    const viewport = container.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]'
    );
    const content = viewport?.firstElementChild as HTMLElement | null;

    if (viewport) {
      resizeObserver.observe(viewport);
    }

    if (content) {
      resizeObserver.observe(content);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [listing.tags]);

  return (
    <Card
      className={cn(
        'group overflow-hidden rounded-[1.75rem] border-white/10 bg-white/8 p-0 text-white shadow-[0_18px_72px_rgba(4,11,24,0.18)] backdrop-blur-xl',
        resolvedSettings.highlight ? 'ring-1 ring-amber-300/25' : '',
        resolvedSettings.className
      )}
    >
      <div className="relative overflow-hidden">
        <PropertyCarousel
          listing={listing}
          onMediaClick={onMediaClick}
          showNavigation={resolvedSettings.showCarouselNavigation}
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            {resolvedSettings.showBadges
              ? listing.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className="rounded-full bg-slate-950/55 px-3 py-1 text-[11px] tracking-[0.18em] text-white backdrop-blur-xl"
                  >
                    {badge}
                  </Badge>
                ))
              : null}
          </div>

          {resolvedSettings.showSaveButton ? (
            <Button
              type="button"
              aria-label={`Save ${listing.title}`}
              variant="ghost"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-slate-950/45 p-0 text-white transition-colors hover:bg-slate-950/65"
              onClick={() => onSave?.(listing)}
            >
              <Heart className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-amber-200">
                {listing.price}
              </p>
              <h3 className="mt-1 text-xl font-medium text-white">
                {listing.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/62">
            <MapPin className="h-4 w-4" />
            {listing.location}
          </div>
        </div>

        {resolvedSettings.showTags ? (
          <div ref={tagCarouselRef} className="max-w-full">
            <BrandsCarousel
              brands={tagBrands}
              showNavigation={false}
              autoplay={false}
              playOnHover={shouldScrollTagCarousel}
              stopOnInteraction={false}
              loop={false}
              badgeVariant={BadgeVariants.OUTLINE}
              classes={{
                wrapper: 'w-full',
                content: '!ml-0 md:!ml-0',
                prev: 'left-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80',
                next: 'right-0 h-7 w-7 border-white/12 bg-slate-950/70 text-white hover:bg-slate-950/80',
              }}
            />
          </div>
        ) : null}

        {resolvedSettings.showStats ? (
          <div className="grid grid-cols-3 gap-3 rounded-[1.25rem] border border-white/8 bg-slate-950/22 p-4 text-sm text-white/76">
            <div className="space-y-1">
              <p className="text-white/48">Beds</p>
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-amber-100" />
                <span>{listing.stats.beds ?? '-'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/48">Baths</p>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-emerald-200" />
                <span>{listing.stats.baths ?? '-'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/48">Area</p>
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-sapphire-100" />
                <span>{listing.stats.area}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default PropertyCard;
