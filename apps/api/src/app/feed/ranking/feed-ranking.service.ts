import { Injectable } from '@nestjs/common';
import type { FeedScoreBreakdown, Property } from '@org/types';
import type { PropertyEngagementSignals } from './feed-ranking.types';

@Injectable()
export class FeedRankingService {
  scoreProperty(property: Property, engagement: PropertyEngagementSignals): FeedScoreBreakdown {
    const ageInHours = Math.max(1, (Date.now() - property.createdAt.getTime()) / 3_600_000);
    const recency = Math.max(0, 100 - ageInHours);
    const engagementScore =
      engagement.views * 0.25 + engagement.likes * 2 + engagement.saves * 3 + engagement.shares * 4;
    const ripple = engagement.shares * 6;

    return {
      recency: this.roundScore(recency),
      engagement: this.roundScore(engagementScore),
      ripple: this.roundScore(ripple),
    };
  }

  totalScore(scoreBreakdown: FeedScoreBreakdown): number {
    return this.roundScore(
      scoreBreakdown.recency + scoreBreakdown.engagement + scoreBreakdown.ripple,
    );
  }

  private roundScore(score: number): number {
    return Number(score.toFixed(2));
  }
}
