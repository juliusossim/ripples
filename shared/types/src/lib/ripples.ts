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

export interface CreatePropertyRequest {
  title: string;
  description: string;
  location: Property['location'];
  price: Property['price'];
  media: Omit<Media, 'id'>[];
  status?: PropertyListingStatus;
}

export interface PropertyInteractionRequest {
  sessionId: string;
  userId?: string;
}

export interface PropertyInteractionResponse {
  property: Property;
  event: Event;
}

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

export interface FeedItemResponse extends FeedItem {
  scoreBreakdown: FeedScoreBreakdown;
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

export type AuthProvider = 'manual' | 'google';

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: UserRole[];
  providers: AuthProvider[];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface AuthSession {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RegisterManualRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginManualRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface GoogleOAuthStartRequest {
  redirectUri: string;
}

export interface GoogleOAuthStartResponse {
  authorizationUrl: string;
  state: string;
  expiresAt: Date;
}

export interface GoogleOAuthCallbackRequest {
  code: string;
  state: string;
  redirectUri: string;
}
