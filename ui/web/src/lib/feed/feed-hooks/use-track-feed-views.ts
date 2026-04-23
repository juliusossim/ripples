import { useEffect, useRef } from 'react';
import type { UseTrackFeedViewsInput } from '../feed.types';

export function useTrackFeedViews({
  items,
  sessionId,
  trackInteraction,
  userId,
}: Readonly<UseTrackFeedViewsInput>): void {
  const trackedViews = useRef(new Set<string>());

  useEffect(() => {
    items?.forEach((item) => {
      if (item.type !== 'property') {
        return;
      }

      const propertyId = item.id.replace('property:', '');
      if (trackedViews.current.has(propertyId)) {
        return;
      }

      trackedViews.current.add(propertyId);
      trackInteraction({
        propertyId,
        interaction: 'view',
        payload: {
          sessionId,
          userId,
        },
      });
    });
  }, [items, sessionId, trackInteraction, userId]);
}
