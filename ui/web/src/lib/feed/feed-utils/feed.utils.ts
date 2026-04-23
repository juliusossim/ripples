import { formatCurrency } from '@org/utils';
import type {
  FeedItemResponse,
  FeedPrimaryReason,
  FeedRankingLabel,
  FeedReasonBadge,
} from '@org/types';
import type { FeedView } from '../feed.types';

export function readWorkspaceError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export interface FeedStreamItem {
  readonly authorInitials: string;
  readonly authorName: string;
  readonly authorRole: string;
  readonly createdAtLabel: string;
  readonly description: string;
  readonly surfaceLabel: string;
  readonly id: string;
  readonly locationLabel?: string;
  readonly mediaItems: readonly {
    readonly alt: string;
    readonly poster?: string;
    readonly type: 'image' | 'video';
    readonly url: string;
  }[];
  readonly priceLabel?: string;
  readonly primaryReason: string;
  readonly propertyId: string;
  readonly rankingLabel: string;
  readonly reasonBadges: readonly string[];
  readonly recommendationSummary: string;
  readonly scoreLabel: string;
  readonly statusLabel: string;
  readonly tags: readonly string[];
  readonly title: string;
  readonly viewsLabel: string;
}

export function formatMetric(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return `${value}`;
}

export function readFeedStreamItem(item: FeedItemResponse): FeedStreamItem {
  const metadata = item.content.metadata;
  const location = readRecord(metadata.location);
  const price = readRecord(metadata.price);
  const city = readString(location.city, 'Unknown city');
  const country = readString(location.country, 'Unknown country');
  const amount = readNumber(price.amount, 0);
  const currency = readString(price.currency, 'USD');
  const propertyId = readString(metadata.propertyId, item.id.replace('property:', ''));
  const title = readTitle(item, metadata);
  const statusLabel = readStatusLabel(item, metadata);
  const locationLabel = hasLocation(location) ? `${city}, ${country}` : undefined;
  const priceLabel = hasPrice(price) ? formatCurrency(amount, currency) : undefined;

  return {
    authorInitials: readInitials(item.social.author.name),
    authorName: item.social.author.name,
    authorRole: item.social.author.role,
    createdAtLabel: readDateLabel(item.content.createdAt),
    description: readString(
      readBody(item, metadata),
      'A ranked feed post ready for discovery, saves, and shares.',
    ),
    surfaceLabel: readSurfaceLabel(item),
    id: item.id,
    locationLabel,
    mediaItems: readMediaItems(item, title),
    priceLabel,
    primaryReason: formatPrimaryReason(item.social.primaryReason),
    propertyId,
    rankingLabel: formatRankingLabel(item.social.rankingLabel),
    reasonBadges: item.social.reasonBadges.map(formatReasonBadge),
    recommendationSummary: item.social.recommendationSummary,
    scoreLabel: Math.round(item.score).toString(),
    statusLabel,
    tags: [`#${toTag(city)}`, `#${toTag(country)}`, `#${toTag(statusLabel)}`],
    title,
    viewsLabel: `${formatMetric(item.social.views)} views`,
  };
}

export function sortFeedItems(
  items: readonly FeedItemResponse[],
  activeView: FeedView,
): FeedItemResponse[] {
  return [...items].sort((left, right) => {
    if (activeView === 'Newest') {
      return (
        new Date(right.content.createdAt).getTime() - new Date(left.content.createdAt).getTime()
      );
    }

    if (activeView === 'Most liked') {
      return (
        right.content.engagement.likes - left.content.engagement.likes || right.score - left.score
      );
    }

    if (activeView === 'Most saved') {
      return (
        right.content.engagement.saves - left.content.engagement.saves || right.score - left.score
      );
    }

    if (activeView === 'Most viewed') {
      return readViews(right) - readViews(left) || right.score - left.score;
    }

    return right.score - left.score;
  });
}

function readDateLabel(value: Date | string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function hasLocation(value: Record<string, unknown>): boolean {
  return typeof value.city === 'string' && typeof value.country === 'string';
}

function hasPrice(value: Record<string, unknown>): boolean {
  return typeof value.amount === 'number' && typeof value.currency === 'string';
}

function readInitials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatPrimaryReason(value: FeedPrimaryReason): string {
  if (value === 'trending_with_buyers') {
    return 'Trending with buyers';
  }

  if (value === 'fresh_to_feed') {
    return 'Fresh to the feed';
  }

  if (value === 'strong_ripple_score') {
    return 'Strong ripple score';
  }

  return 'Ranked for you';
}

function formatRankingLabel(value: FeedRankingLabel): string {
  if (value === 'top_match') {
    return 'Top match';
  }

  if (value === 'momentum') {
    return 'Momentum';
  }

  return 'Fresh pick';
}

function formatReasonBadge(value: FeedReasonBadge): string {
  if (value === 'rising_saves') {
    return 'Rising saves';
  }

  if (value === 'just_listed') {
    return 'Just listed';
  }

  if (value === 'watched_often') {
    return 'Watched often';
  }

  return 'Low-friction discovery';
}

function readBody(item: FeedItemResponse, metadata: Record<string, unknown>): string {
  if (item.type === 'live-event') {
    return readString(
      metadata.summary,
      'Join the latest walkthrough, AMA, or open-home event inside the feed.',
    );
  }

  if (item.type !== 'property') {
    return readString(
      metadata.summary,
      'A high-signal trend is moving through the market and deserves another look.',
    );
  }

  return readString(metadata.description, 'A ranked property post ready for discovery.');
}

function readMediaItems(item: FeedItemResponse, fallbackAlt: string): FeedStreamItem['mediaItems'] {
  if (item.content.media.length === 0) {
    return [
      {
        alt: fallbackAlt,
        type: 'image',
        url: '',
      },
    ];
  }

  return item.content.media.map((media) => ({
    alt: media.alt || fallbackAlt,
    poster: undefined,
    type: media.type,
    url: media.url,
  }));
}

function readStatusLabel(item: FeedItemResponse, metadata: Record<string, unknown>): string {
  if (item.type === 'live-event') {
    return readString(metadata.eventStatus, 'Live');
  }

  if (item.type !== 'property') {
    return readString(metadata.trendStatus, 'Trending');
  }

  return readString(metadata.status, 'active').replace('-', ' ');
}

function readSurfaceLabel(item: FeedItemResponse): string {
  if (item.type === 'live-event') {
    return 'Event';
  }

  if (item.type === 'property') {
    return 'Property';
  }

  return 'Trending';
}

function readTitle(item: FeedItemResponse, metadata: Record<string, unknown>): string {
  if (item.type === 'live-event') {
    return readString(metadata.eventTitle, readString(metadata.title, 'Untitled event'));
  }

  if (item.type !== 'property') {
    return readString(metadata.headline, readString(metadata.title, 'Untitled trend'));
  }

  return readString(metadata.title, 'Untitled listing');
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readViews(item: FeedItemResponse): number {
  return item.social.views;
}

function toTag(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}
