import type { Property } from '@org/types';
import { FeedRankingService } from './feed-ranking.service';

describe('FeedRankingService', () => {
  it('weights recency, engagement, and ripple activity', () => {
    const service = new FeedRankingService();
    const property = createProperty(new Date(Date.now() - 2 * 3_600_000));

    const score = service.scoreProperty(property, {
      likes: 2,
      saves: 1,
      shares: 2,
      views: 10,
    });

    expect(score).toEqual({
      recency: expect.any(Number) as number,
      engagement: 17.5,
      ripple: 12,
    });
    expect(service.totalScore(score)).toBe(score.recency + 29.5);
  });

  it('never returns negative recency for old listings', () => {
    const service = new FeedRankingService();
    const property = createProperty(new Date(Date.now() - 200 * 3_600_000));

    const score = service.scoreProperty(property, { likes: 0, saves: 0, shares: 0, views: 0 });

    expect(score.recency).toBe(0);
  });
});

function createProperty(createdAt: Date): Property {
  return {
    id: 'property-1',
    title: 'Waterfront apartment',
    description: 'A strong listing for feed ranking tests.',
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
