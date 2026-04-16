import type { FeedItemResponse } from '@org/types';
import type { PropertyInteractionName } from '@org/data';

export interface PropertyCardProps {
  readonly item: FeedItemResponse;
  readonly isInteracting?: boolean;
  readonly onInteraction: (interaction: PropertyInteractionName, propertyId: string) => void;
}

export interface PropertyCardMetadata {
  readonly propertyId: string;
  readonly title: string;
  readonly description: string;
  readonly locationLabel: string;
  readonly priceLabel: string;
  readonly status: string;
  readonly views: number;
}

export interface PropertyMetricProps {
  readonly label: string;
  readonly value: number;
}
