import { Controller, Get, Query } from '@nestjs/common';
import type { FeedResponse } from '@org/types';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@Query('limit') limit?: string, @Query('cursor') cursor?: string): Promise<FeedResponse> {
    return this.feedService.getFeed(limit, cursor);
  }
}
