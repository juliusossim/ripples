import { Badge, Button, Card } from '@org/ui-primitives';
import type { PropertyInteractionName } from '@org/data';
import { useEffect, useState, type ReactElement } from 'react';
import type { FeedItemResponse } from '@org/types';
import { ProductCarousel } from './product-carousel';
import { formatMetric, readFeedStreamItem } from '../feed-utils/feed.utils';

const actionLabels: Record<PropertyInteractionName, string> = {
  like: 'Like',
  save: 'Save',
  share: 'Share',
  view: 'View',
};

export interface FeedPostCardProps {
  readonly isInteracting?: boolean;
  readonly item: FeedItemResponse;
  readonly onInteraction: (interaction: PropertyInteractionName, propertyId: string) => void;
}

export function FeedPostCard({
  isInteracting = false,
  item,
  onInteraction,
}: Readonly<FeedPostCardProps>): ReactElement {
  const post = readFeedStreamItem(item);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.content.engagement.likes);

  useEffect(() => {
    setIsLiked(false);
    setLikeCount(item.content.engagement.likes);
  }, [item.content.engagement.likes, item.id]);

  function likeOnce(): void {
    if (isLiked) {
      return;
    }

    setIsLiked(true);
    setLikeCount((current) => current + 1);
    onInteraction('like', post.propertyId);
  }

  function toggleLike(): void {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((current) => Math.max(0, current - 1));
      return;
    }

    likeOnce();
  }

  function readActionClassName(interaction: 'like' | 'save' | 'share'): string {
    if (interaction === 'like' && isLiked) {
      return 'border-rose-400/30 bg-rose-500/15 text-rose-200 hover:bg-rose-500/20';
    }

    if (interaction === 'share') {
      return 'border-white/16 bg-white/10 text-white hover:bg-white/14';
    }

    return 'border-white/16 bg-transparent text-white hover:bg-white/10';
  }

  return (
    <Card className="overflow-hidden rounded-[2rem] border-white/8 bg-[linear-gradient(180deg,#08172b_0%,#0b203a_100%)] p-0 text-white shadow-[0_24px_100px_rgba(4,11,24,0.18)]">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm font-semibold text-white">
              {post.authorInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{post.authorName}</p>
                <Badge className="rounded-full bg-emerald-600/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                  {post.rankingLabel}
                </Badge>
              </div>
              <p className="text-sm text-white/58">
                {post.authorRole} • {post.createdAtLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/72 backdrop-blur-xl">
            <span>{post.viewsLabel}</span>
            <span className="text-white/40">•</span>
            <span>score {post.scoreLabel}</span>
          </div>
        </div>

        <ProductCarousel
          isLiked={isLiked}
          item={post}
          onDoubleLike={likeOnce}
          onToggleLike={toggleLike}
        />

        <div className="space-y-4 px-1 pb-1">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/58">
              <Badge className="rounded-full bg-amber-300/16 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-200">
                {post.surfaceLabel}
              </Badge>
              <Badge className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/78">
                {post.locationLabel ?? 'Market signal'}
              </Badge>
              <span>{post.statusLabel}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/78">{post.description}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
            <p className="text-sm font-semibold text-white">Why this is surfacing</p>
            <p className="mt-2 text-sm leading-6 text-white/66">{post.recommendationSummary}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-amber-200">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border border-white/10 bg-white/6 p-3 text-center">
            <Metric label="Likes" value={formatMetric(likeCount)} />
            <Metric label="Saves" value={formatMetric(item.content.engagement.saves)} />
            <Metric label="Shares" value={formatMetric(item.content.engagement.shares)} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['like', 'save', 'share'] as const).map((interaction) => (
              <Button
                className={readActionClassName(interaction)}
                disabled={isInteracting}
                key={interaction}
                onClick={() => {
                  if (interaction === 'like') {
                    toggleLike();
                    return;
                  }

                  onInteraction(interaction, post.propertyId);
                }}
                size="sm"
                variant="outline"
              >
                {interaction === 'like' && isLiked ? 'Liked' : actionLabels[interaction]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>): ReactElement {
  return (
    <div>
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="text-xs text-white/58">{label}</p>
    </div>
  );
}
