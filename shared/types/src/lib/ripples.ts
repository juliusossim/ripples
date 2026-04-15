export type FeedItemType = 'property' | 'ripple' | 'campaign' | 'live-event' | 'news' | 'user-post';

export type EventType =
  | 'view_property'
  | 'like_property'
  | 'save_property'
  | 'share_property'
  | 'click_ripple'
  | 'contact_seller'
  | 'start_transaction'
  | 'complete_transaction';

export type PropertyListingStatus = 'draft' | 'active' | 'under-offer' | 'sold' | 'archived';

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  alt: string;
}

export interface EngagementSummary {
  likes: number;
  saves: number;
  shares: number;
}

export interface Content {
  id: string;
  type: FeedItemType;
  createdBy: string;
  media: Media[];
  metadata: Record<string, unknown>;
  engagement: EngagementSummary;
  createdAt: Date;
}

export interface Event {
  id: string;
  userId?: string;
  sessionId: string;
  type: EventType;
  entityId: string;
  entityType: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  price: {
    amount: number;
    currency: string;
  };
  media: Media[];
  status: PropertyListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  content: Content;
  score: number;
}

export interface RecommendationEngine {
  getFeed(userId: string): Promise<FeedItem[]>;
  rankListings(listings: Property[]): Promise<Property[]>;
  getPersonalizedListings(userId: string): Promise<Property[]>;
}
