import { testFeedResponse } from '../../auth/testing/auth-test-fixtures';
import { readFeedStreamItem, sortFeedItems } from './feed.utils';

describe('feed utils', () => {
  it('maps a feed item into a social stream card shape', () => {
    const streamItem = readFeedStreamItem(testFeedResponse.items[0]);

    expect(streamItem.authorName).toBe('Ripples Feed');
    expect(streamItem.priceLabel).toBe('$250,000');
    expect(streamItem.locationLabel).toBe('Accra, Ghana');
    expect(streamItem.primaryReason).toBe('Fresh to the feed');
  });

  it('sorts feed items by the selected local view', () => {
    const items = [
      testFeedResponse.items[0],
      {
        ...testFeedResponse.items[0],
        id: 'property:property_2',
        score: 10,
        social: {
          ...testFeedResponse.items[0].social,
          views: 50,
        },
        content: {
          ...testFeedResponse.items[0].content,
          createdAt: new Date('2026-04-16T00:00:00.000Z'),
          engagement: {
            likes: 12,
            saves: 3,
            shares: 1,
          },
          metadata: {
            ...testFeedResponse.items[0].content.metadata,
            propertyId: 'property_2',
            title: 'City apartment',
            views: 50,
          },
        },
      },
    ];

    expect(sortFeedItems(items, 'Newest')[0]?.id).toBe('property:property_2');
    expect(sortFeedItems(items, 'Most liked')[0]?.id).toBe('property:property_2');
    expect(sortFeedItems(items, 'Most viewed')[0]?.id).toBe('property:property_2');
    expect(sortFeedItems(items, 'For you')[0]?.id).toBe('property:property_1');
  });

  it('maps event and trending items into the right feed surface labels', () => {
    const eventItem = {
      ...testFeedResponse.items[0],
      id: 'event:open-home-1',
      type: 'live-event' as const,
      content: {
        ...testFeedResponse.items[0].content,
        metadata: {
          eventTitle: 'Open home tonight',
          eventStatus: 'Happening now',
          summary: 'Walk through the space live and ask the host questions in real time.',
        },
      },
    };
    const trendingItem = {
      ...testFeedResponse.items[0],
      id: 'trend:waterfront-demand',
      type: 'news' as const,
      content: {
        ...testFeedResponse.items[0].content,
        metadata: {
          headline: 'Waterfront demand keeps climbing',
          trendStatus: 'Trending now',
          summary: 'Buyer demand is clustering around premium waterfront inventory this week.',
        },
      },
    };

    expect(readFeedStreamItem(eventItem).surfaceLabel).toBe('Event');
    expect(readFeedStreamItem(trendingItem).surfaceLabel).toBe('Trending');
  });
});
