import type { Content, Event, FeedItemType, SessionProfile } from './types.js';

describe('types', () => {
  it('should define SessionProfile interface', () => {
    const profile: SessionProfile = {
      userName: 'test',
      preferredLanguage: 'en',
    };
    expect(profile.userName).toEqual('test');
  });

  it('should define Ripples feed content and event contracts', () => {
    const type: FeedItemType = 'property';
    const content: Content = {
      id: 'content-1',
      type,
      createdBy: 'user-1',
      media: [],
      metadata: { bedrooms: 3 },
      engagement: {
        likes: 10,
        saves: 4,
        shares: 2,
      },
      createdAt: new Date('2026-04-15T00:00:00.000Z'),
    };
    const event: Event = {
      id: 'event-1',
      sessionId: 'session-1',
      type: 'view_property',
      entityId: content.id,
      entityType: content.type,
      metadata: {},
      createdAt: content.createdAt,
    };

    expect(content.type).toEqual('property');
    expect(event.type).toEqual('view_property');
  });
});
