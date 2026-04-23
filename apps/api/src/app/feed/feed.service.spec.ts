import type {
  FeedAuthorSummary,
  FeedItemResponse,
  FeedPrimaryReason,
  FeedRankingLabel,
  FeedReasonBadge,
  FeedScoreBreakdown,
  Property,
} from '@org/types';
import { FeedService } from './feed.service';
import type { PropertyService } from '../property/property.service';
import type { EventsService } from '../events/events.service';
import type { FeedRankingService } from './ranking/feed-ranking.service';

describe('FeedService', () => {
  it('returns mixed feed items with social metadata', async () => {
    const property = createProperty();
    const propertyService = {
      findActive: jest.fn<Promise<Property[]>, []>().mockResolvedValue([property]),
    } as Pick<PropertyService, 'findActive'>;
    const eventsService = {
      countForEntity: jest
        .fn<Promise<number>, [string, string]>()
        .mockImplementation(async (_entityId, type) => {
          if (type === 'like_property') {
            return 8;
          }
          if (type === 'save_property') {
            return 5;
          }
          if (type === 'share_property') {
            return 4;
          }

          return 27;
        }),
    } as Pick<EventsService, 'countForEntity'>;
    const scoreBreakdown: FeedScoreBreakdown = {
      recency: 88,
      engagement: 41,
      ripple: 24,
    };
    const feedRankingService = {
      scoreProperty: jest
        .fn<FeedScoreBreakdown, [Property, object]>()
        .mockReturnValue(scoreBreakdown),
      totalScore: jest.fn<number, [FeedScoreBreakdown]>().mockReturnValue(153),
    } as Pick<FeedRankingService, 'scoreProperty' | 'totalScore'>;
    const service = new FeedService(
      propertyService as PropertyService,
      eventsService as EventsService,
      feedRankingService as FeedRankingService,
    );

    const response = await service.getFeed();

    expect(response.items).toHaveLength(3);
    expect(response.items.map((item) => item.type)).toEqual(
      expect.arrayContaining(['property', 'live-event', 'news']),
    );
    expect(response.items.find((item) => item.type === 'property')).toEqual(
      expect.objectContaining({
        content: expect.objectContaining({
          metadata: expect.objectContaining({
            propertyId: property.id,
            views: 27,
          }),
        }),
        score: 153,
        scoreBreakdown,
        social: {
          author: createAuthor('Community momentum'),
          primaryReason: 'trending_with_buyers' satisfies FeedPrimaryReason,
          rankingLabel: 'top_match' satisfies FeedRankingLabel,
          reasonBadges: [
            'rising_saves',
            'just_listed',
            'watched_often',
          ] satisfies FeedReasonBadge[],
          recommendationSummary:
            'Trending with buyers because it is very fresh, carries strong social traction, and has a ripple score of 24.',
          views: 27,
        },
      } satisfies Partial<FeedItemResponse>),
    );
    expect(response.items.find((item) => item.type === 'live-event')).toEqual(
      expect.objectContaining({
        content: expect.objectContaining({
          metadata: expect.objectContaining({
            eventTitle: 'Waterfront apartment live walkthrough',
            eventStatus: 'Happening now',
            propertyId: property.id,
          }),
        }),
        social: expect.objectContaining({
          author: expect.objectContaining({
            name: 'Ripples Live',
            role: 'Live host',
          }),
          primaryReason: 'fresh_to_feed',
        }),
      } satisfies Partial<FeedItemResponse>),
    );
    expect(response.items.find((item) => item.type === 'news')).toEqual(
      expect.objectContaining({
        content: expect.objectContaining({
          metadata: expect.objectContaining({
            headline: 'Accra, Ghana demand is climbing around Waterfront apartment',
            trendStatus: 'Trending now',
            propertyId: property.id,
          }),
        }),
        social: expect.objectContaining({
          author: expect.objectContaining({
            name: 'Ripples Trends',
            role: 'Market pulse',
          }),
          primaryReason: 'trending_with_buyers',
        }),
      } satisfies Partial<FeedItemResponse>),
    );
  });
});

function createAuthor(role: string): FeedAuthorSummary {
  return {
    id: 'system',
    name: 'Ripples Feed',
    role,
    source: 'system',
    verified: true,
  };
}

function createProperty(): Property {
  const createdAt = new Date(Date.now() - 2 * 3_600_000);

  return {
    id: 'property-1',
    title: 'Waterfront apartment',
    description: 'A strong listing for ranked feed tests.',
    location: {
      city: 'Accra',
      country: 'Ghana',
    },
    price: {
      amount: 250000,
      currency: 'USD',
    },
    media: [],
    status: 'active',
    createdAt,
    updatedAt: createdAt,
  };
}
