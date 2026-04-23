import { formatCurrency } from '@org/utils';
import type { FeedItemResponse } from '@org/types';
import type { PropertyCardMetadata } from './property-card.types';

export function readPropertyCardMetadata(item: FeedItemResponse): PropertyCardMetadata {
  const metadata = item.content.metadata;
  const location = readRecord(metadata.location);
  const price = readRecord(metadata.price);
  const city = readString(location.city, 'Unknown city');
  const country = readString(location.country, 'Unknown country');
  const amount = readNumber(price.amount, 0);
  const currency = readString(price.currency, 'USD');

  return {
    propertyId: readString(metadata.propertyId, item.id.replace('property:', '')),
    title: readString(metadata.title, 'Untitled listing'),
    description: readString(metadata.description, ''),
    locationLabel: `${city}, ${country}`,
    priceLabel: formatCurrency(amount, currency),
    status: readString(metadata.status, 'active'),
    views: item.social.views,
  };
}

export function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
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
