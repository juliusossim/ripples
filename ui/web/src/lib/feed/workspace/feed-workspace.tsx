import { useState, type ReactElement } from 'react';
import {
  useCreatePropertyMutation,
  useFeedQuery,
  usePropertyInteractionMutation,
  useRipplesClientStore,
  type PropertyInteractionName,
} from '@org/data';
import type { CreatePropertyRequest } from '@org/types';
import { useSession } from '../../session/provider/session-provider';
import { PropertyCard } from '../../property/card/property-card';
import { FeedWorkspaceCreatePanel } from './feed-workspace-create-panel';
import { FeedHeader, FeedState } from './feed-workspace-status';
import type { FeedWorkspaceProps } from './feed-workspace.types';
import { readWorkspaceError } from './feed-workspace.utils';
import { useTrackFeedViews } from './use-track-feed-views';

export function FeedWorkspace({
  title = 'Feed workspace',
}: Readonly<FeedWorkspaceProps>): ReactElement {
  const { accessToken, user } = useSession();
  const sessionId = useRipplesClientStore((state) => state.sessionId);
  const feed = useFeedQuery({ accessToken, limit: 20 });
  const createProperty = useCreatePropertyMutation(accessToken);
  const interaction = usePropertyInteractionMutation(accessToken);
  const { isPending: isInteracting, mutate: trackPropertyInteraction } = interaction;
  const [formError, setFormError] = useState<string | undefined>();

  useTrackFeedViews({
    items: feed.data?.items,
    sessionId,
    trackInteraction: trackPropertyInteraction,
    userId: user?.id,
  });

  async function publishProperty(input: CreatePropertyRequest): Promise<void> {
    setFormError(undefined);
    try {
      await createProperty.mutateAsync(input);
    } catch (error) {
      setFormError(readWorkspaceError(error));
    }
  }

  function trackInteraction(interactionName: PropertyInteractionName, propertyId: string): void {
    trackPropertyInteraction({
      propertyId,
      interaction: interactionName,
      payload: {
        sessionId,
        userId: user?.id,
      },
    });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[400px_1fr]">
      <div className="space-y-4">
        <FeedWorkspaceCreatePanel
          accessToken={accessToken}
          error={formError}
          isSubmitting={createProperty.isPending}
          onSubmit={publishProperty}
          title={title}
        />
      </div>
      <div className="space-y-4">
        <FeedHeader count={feed.data?.items.length ?? 0} isLoading={feed.isLoading} />
        {feed.isError ? (
          <FeedState message={readWorkspaceError(feed.error)} title="Feed unavailable" />
        ) : null}
        {feed.isLoading ? (
          <FeedState message="Loading ranked listings." title="Loading feed" />
        ) : null}
        {!feed.isLoading && feed.data?.items.length === 0 ? (
          <FeedState
            message="Publish the first listing to start the discovery loop."
            title="No listings yet"
          />
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          {feed.data?.items.map((item) => (
            <PropertyCard
              isInteracting={isInteracting}
              item={item}
              key={item.id}
              onInteraction={trackInteraction}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
