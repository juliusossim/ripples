import type { EngagementSummary } from './engagement.types.js';
import type { Media } from './media.types.js';

export type FeedItemType = 'property' | 'ripple' | 'campaign' | 'live-event' | 'news' | 'user-post';

export interface Content {
  id: string;
  type: FeedItemType;
  createdBy: string;
  media: Media[];
  metadata: Record<string, unknown>;
  engagement: EngagementSummary;
  createdAt: Date;
}
