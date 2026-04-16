import type { ReactElement } from 'react';
import { Badge } from '@org/ui-primitives';
import type { FeedHeaderProps, FeedStateProps } from './feed-workspace-status.types';

export function FeedHeader({ count, isLoading }: Readonly<FeedHeaderProps>): ReactElement {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Ranked by recency, engagement, and ripples</p>
        <h2 className="text-2xl font-semibold tracking-normal">Property feed</h2>
      </div>
      <Badge variant="outline">{isLoading ? 'Syncing' : `${count} items`}</Badge>
    </div>
  );
}

export function FeedState({ message, title }: Readonly<FeedStateProps>): ReactElement {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold tracking-normal">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
