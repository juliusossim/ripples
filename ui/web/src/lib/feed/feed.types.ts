import type { PropertyInteractionName } from '@org/data';
import type { FeedItemResponse } from '@org/types';

export interface FeedWorkspaceProps {
  readonly title?: string;
}

export type FeedView = 'For you' | 'Newest' | 'Most liked' | 'Most saved' | 'Most viewed';

export const FEED_VIEWS: readonly FeedView[] = [
  'For you',
  'Newest',
  'Most liked',
  'Most saved',
  'Most viewed',
];

export interface TrackFeedInteractionInput {
  readonly propertyId: string;
  readonly interaction: PropertyInteractionName;
  readonly payload: {
    readonly sessionId: string;
    readonly userId?: string;
  };
}

export interface UseTrackFeedViewsInput {
  readonly items?: FeedItemResponse[];
  readonly sessionId: string;
  readonly trackInteraction: (input: TrackFeedInteractionInput) => void;
  readonly userId?: string;
}
