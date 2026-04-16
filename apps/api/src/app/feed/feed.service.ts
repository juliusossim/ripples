import { Injectable } from '@nestjs/common';
import type { Content, FeedItemResponse, FeedResponse, Property } from '@org/types';
import { EventsService } from '../events/events.service';
import { PropertyService } from '../property/property.service';
import { FeedRankingService } from './ranking/feed-ranking.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly eventsService: EventsService,
    private readonly feedRankingService: FeedRankingService,
  ) {}

  async getFeed(limit?: string, cursor?: string): Promise<FeedResponse> {
    const pageSize = this.decodeLimit(limit);
    const offset = this.decodeCursor(cursor);
    const properties = await this.propertyService.findActive();
    const items = (await Promise.all(properties.map((property) => this.toFeedItem(property)))).sort(
      (left, right) =>
        right.score - left.score ||
        right.content.createdAt.getTime() - left.content.createdAt.getTime(),
    );
    const page = items.slice(offset, offset + pageSize);
    const nextOffset = offset + page.length;

    return {
      items: page,
      nextCursor: nextOffset < items.length ? String(nextOffset) : undefined,
    };
  }

  private async toFeedItem(property: Property): Promise<FeedItemResponse> {
    const [likes, saves, shares, views] = await Promise.all([
      this.eventsService.countForEntity(property.id, 'like_property'),
      this.eventsService.countForEntity(property.id, 'save_property'),
      this.eventsService.countForEntity(property.id, 'share_property'),
      this.eventsService.countForEntity(property.id, 'view_property'),
    ]);
    const content: Content = {
      id: `property:${property.id}`,
      type: 'property',
      createdBy: 'system',
      media: property.media,
      metadata: {
        propertyId: property.id,
        title: property.title,
        description: property.description,
        location: property.location,
        price: property.price,
        status: property.status,
        views,
      },
      engagement: {
        likes,
        saves,
        shares,
      },
      createdAt: property.createdAt,
    };
    const scoreBreakdown = this.feedRankingService.scoreProperty(property, {
      likes,
      saves,
      shares,
      views,
    });

    return {
      id: content.id,
      type: 'property',
      content,
      score: this.feedRankingService.totalScore(scoreBreakdown),
      scoreBreakdown,
    };
  }

  private decodeCursor(cursor?: string): number {
    if (!cursor) {
      return 0;
    }

    const offset = Number.parseInt(cursor, 10);
    if (Number.isNaN(offset) || offset < 0) {
      return 0;
    }

    return offset;
  }

  private decodeLimit(limit?: string): number {
    if (!limit) {
      return 20;
    }

    const pageSize = Number.parseInt(limit, 10);
    if (Number.isNaN(pageSize)) {
      return 20;
    }

    return Math.min(Math.max(pageSize, 1), 50);
  }
}
