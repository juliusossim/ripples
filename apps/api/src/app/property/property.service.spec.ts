import type { Event as RipplesEvent, Property } from '@org/types';
import { PropertyService } from './property.service';
import type { PropertyRepository } from './property.repository';
import type { EventsService } from '../events/events.service';

describe('PropertyService', () => {
  it('tracks property interactions against existing listings', async () => {
    const property = createProperty();
    const event = createEvent();
    const propertyRepository = {
      findById: jest.fn<Promise<Property>, [string]>().mockResolvedValue(property),
    } as Pick<PropertyRepository, 'findById'>;
    const eventsService = {
      track: jest
        .fn<Promise<RipplesEvent>, [Parameters<EventsService['track']>[0]]>()
        .mockResolvedValue(event),
    } as Pick<EventsService, 'track'>;
    const service = new PropertyService(
      propertyRepository as PropertyRepository,
      eventsService as EventsService,
    );

    await expect(
      service.trackInteraction(
        property.id,
        {
          sessionId: 'session-1',
          userId: 'user-1',
        },
        'like_property',
      ),
    ).resolves.toEqual({ property, event });

    expect(eventsService.track).toHaveBeenCalledWith({
      sessionId: 'session-1',
      userId: 'user-1',
      type: 'like_property',
      entityId: property.id,
      entityType: 'property',
      metadata: {},
    });
  });
});

function createProperty(): Property {
  return {
    id: 'property-1',
    title: 'Waterfront apartment',
    description: 'A strong listing for interaction tests.',
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
    createdAt: new Date('2026-04-16T00:00:00.000Z'),
    updatedAt: new Date('2026-04-16T00:00:00.000Z'),
  };
}

function createEvent(): RipplesEvent {
  return {
    id: 'event-1',
    sessionId: 'session-1',
    userId: 'user-1',
    type: 'like_property',
    entityId: 'property-1',
    entityType: 'property',
    metadata: {},
    createdAt: new Date('2026-04-16T00:00:00.000Z'),
  };
}
