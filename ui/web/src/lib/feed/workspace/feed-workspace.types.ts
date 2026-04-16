import type { PropertyInteractionName } from '@org/data';
import type { FeedItemResponse } from '@org/types';

export interface FeedWorkspaceProps {
  readonly title?: string;
}

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
