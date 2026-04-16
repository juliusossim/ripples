import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { PropertyModule } from '../property/property.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { FeedRankingService } from './ranking/feed-ranking.service';

@Module({
  imports: [PropertyModule, EventsModule],
  controllers: [FeedController],
  providers: [FeedRankingService, FeedService],
  exports: [FeedService],
})
export class FeedModule {}
