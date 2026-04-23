import type { Content, FeedItemType } from './content.types.js';
import type { Property } from './property.types.js';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  content: Content;
  score: number;
}

export interface FeedScoreBreakdown {
  recency: number;
  engagement: number;
  ripple: number;
}

export type FeedAuthorSource = 'system' | 'user';

export type FeedRankingLabel = 'top_match' | 'momentum' | 'fresh_pick';

export type FeedPrimaryReason =
  | 'ranked_for_you'
  | 'fresh_to_feed'
  | 'trending_with_buyers'
  | 'strong_ripple_score';

export type FeedReasonBadge =
  | 'just_listed'
  | 'rising_saves'
  | 'watched_often'
  | 'low_friction_discovery';

export interface FeedAuthorSummary {
  id: string;
  name: string;
  role: string;
  verified: boolean;
  source: FeedAuthorSource;
}

export interface FeedSocialMetadata {
  author: FeedAuthorSummary;
  views: number;
  rankingLabel: FeedRankingLabel;
  primaryReason: FeedPrimaryReason;
  reasonBadges: FeedReasonBadge[];
  recommendationSummary: string;
}

export interface FeedItemResponse extends FeedItem {
  scoreBreakdown: FeedScoreBreakdown;
  social: FeedSocialMetadata;
}

export interface FeedResponse {
  items: FeedItemResponse[];
  nextCursor?: string;
}

export interface RecommendationEngine {
  getFeed(userId: string): Promise<FeedItem[]>;
  rankListings(listings: Property[]): Promise<Property[]>;
  getPersonalizedListings(userId: string): Promise<Property[]>;
}
