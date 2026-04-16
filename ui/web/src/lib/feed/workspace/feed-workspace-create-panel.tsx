import type { ReactElement } from 'react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@org/ui-primitives';
import { CreatePropertyForm } from '../../property/create-property/create-property-form';
import type { FeedWorkspaceCreatePanelProps } from './feed-workspace-create-panel.types';

export function FeedWorkspaceCreatePanel({
  accessToken,
  error,
  isSubmitting,
  onSubmit,
  title,
}: Readonly<FeedWorkspaceCreatePanelProps>): ReactElement {
  return (
    <Card>
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          Phase 1
        </Badge>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Create listings, publish them into the feed, and collect ranking signals from every
          interaction.
        </p>
      </CardHeader>
      <CardContent>
        <CreatePropertyForm
          disabled={!accessToken}
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
}
