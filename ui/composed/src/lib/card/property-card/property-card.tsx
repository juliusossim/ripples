import { Bath, BedDouble, Heart, MapPin, Square } from 'lucide-react';
import { Badge, Button, Card, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { Amount } from '../../amount';
import { BrandCarousel, PropertyCarousel } from '../../carousel';
import { TruncatedText } from '../../typography';
import type {
  PropertyCardProps,
  PropertyCardSettings,
  PropertyCardStat,
} from './property-card.types';

const defaultSettings: PropertyCardSettings = {
  highlight: false,
  showBadges: true,
  showTags: true,
  showStats: true,
  showSaveButton: true,
  showPrimaryAction: true,
  showCarouselNavigation: true,
  showCarouselIndicators: true,
};

function resolveSettings(settings?: PropertyCardSettings): PropertyCardSettings {
  return {
    ...defaultSettings,
    ...settings,
  };
}

function renderStat(stat: PropertyCardStat): ReactElement {
  return (
    <div key={stat.label} className="space-y-1">
      <p className="text-white/48">{stat.label}</p>
      <p className="font-medium text-white/84">{stat.value}</p>
    </div>
  );
}

function renderStructuredStats(listing: Readonly<PropertyCardProps['listing']>): ReactElement | null {
  if (!listing.propertyStats) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-3 rounded-[1.25rem] border border-white/8 bg-slate-950/22 p-4 text-sm text-white/76">
      <div className="space-y-1">
        <p className="text-white/48">Beds</p>
        <div className="flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-amber-100" />
          <span>{listing.propertyStats.beds ?? '-'}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-white/48">Baths</p>
        <div className="flex items-center gap-2">
          <Bath className="h-4 w-4 text-emerald-200" />
          <span>{listing.propertyStats.baths ?? '-'}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-white/48">Area</p>
        <div className="flex items-center gap-2">
          <Square className="h-4 w-4 text-sky-100" />
          <span>{listing.propertyStats.area ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}

function renderPriceBlock(listing: Readonly<PropertyCardProps['listing']>): ReactElement | null {
  if (listing.amount) {
    return (
      <Amount
        {...listing.amount}
        className="gap-3"
        valueClassName="text-2xl font-semibold text-amber-200"
      />
    );
  }

  if (listing.priceLabel) {
    return <p className="text-2xl font-semibold text-amber-200">{listing.priceLabel}</p>;
  }

  return null;
}

function renderTagContent(listing: Readonly<PropertyCardProps['listing']>): ReactElement | null {
  if (listing.tagBrands && listing.tagBrands.length > 0) {
    return (
      <BrandCarousel
        badgeVariant="outline"
        brands={listing.tagBrands}
        className="max-w-full"
        contentClassName="!ml-0 md:!ml-0"
        itemClassName="pl-0 md:pl-0"
        showNavigation={false}
      />
    );
  }

  if (listing.tags && listing.tags.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {listing.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-slate-950/22 px-3 py-1 text-xs text-white/74"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  return null;
}

export function PropertyCard({
  listing,
  settings,
  isSaved = false,
  onSave,
  onPrimaryAction,
  onMediaClick,
}: Readonly<PropertyCardProps>): ReactElement {
  const resolvedSettings = resolveSettings(settings);

  return (
    <Card
      className={cn(
        'group overflow-hidden rounded-[1.75rem] border-white/10 bg-white/8 p-0 text-white shadow-[0_18px_72px_rgba(4,11,24,0.18)] backdrop-blur-xl',
        resolvedSettings.highlight ? 'ring-1 ring-amber-300/25' : '',
        resolvedSettings.className,
      )}
    >
      <div className="relative overflow-hidden">
        <PropertyCarousel
          listing={listing}
          onMediaClick={onMediaClick}
          showIndicators={resolvedSettings.showCarouselIndicators}
          showNavigation={resolvedSettings.showCarouselNavigation}
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap gap-2">
            {resolvedSettings.showBadges
              ? listing.badges?.map((badge) => (
                  <Badge
                    key={badge}
                    className="rounded-full bg-slate-950/55 px-3 py-1 text-[11px] tracking-[0.18em] text-white backdrop-blur-xl"
                  >
                    {badge}
                  </Badge>
                )) ?? null
              : null}
          </div>

          {resolvedSettings.showSaveButton ? (
            <Button
              type="button"
              aria-label={isSaved ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-slate-950/45 p-0 text-white transition-colors hover:bg-slate-950/65"
              onClick={() => onSave?.(listing)}
              variant="ghost"
            >
              <Heart className={cn('h-4 w-4', isSaved ? 'fill-rose-500 text-rose-500' : '')} />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {renderPriceBlock(listing)}
              <TruncatedText
                className="mt-1 text-xl font-medium text-white"
                showTooltip
                text={listing.title}
                variant="h4"
              />
            </div>

            {listing.statusLabel ? (
              <Badge className="shrink-0 rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
                {listing.statusLabel}
              </Badge>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-sm text-white/62">
            <MapPin className="h-4 w-4" />
            <span>{listing.locationLabel}</span>
          </div>
          {listing.description ? (
            <TruncatedText
              className="text-sm leading-6 text-white/72"
              lineClamp={3}
              showTooltip={false}
              text={listing.description}
              variant="body2"
            />
          ) : null}
        </div>

        {resolvedSettings.showTags ? renderTagContent(listing) : null}

        {resolvedSettings.showStats
          ? renderStructuredStats(listing) ??
            (listing.stats && listing.stats.length > 0 ? (
              <div
                className={cn(
                  'grid gap-3 rounded-[1.25rem] border border-white/8 bg-slate-950/22 p-4 text-sm text-white/76',
                  listing.stats.length >= 3 ? 'grid-cols-3' : 'grid-cols-2',
                )}
              >
                {listing.stats.map(renderStat)}
              </div>
            ) : null)
          : null}

        {resolvedSettings.showPrimaryAction && listing.primaryActionLabel ? (
          <Button
            type="button"
            className="w-full rounded-full bg-white text-slate-950 hover:bg-slate-100"
            onClick={() => onPrimaryAction?.(listing)}
          >
            {listing.primaryActionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
