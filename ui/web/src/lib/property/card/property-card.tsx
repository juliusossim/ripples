import type { ReactElement } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  MediaRenderer,
} from '@org/ui-primitives';
import type { PropertyInteractionName } from '@org/data';
import type { PropertyCardProps, PropertyMetricProps } from './property-card.types';
import { formatDate, readPropertyCardMetadata } from './property-card.utils';

const interactionLabels: Record<PropertyInteractionName, string> = {
  like: 'Like',
  save: 'Save',
  share: 'Share',
  view: 'View',
};

export function PropertyCard({
  isInteracting = false,
  item,
  onInteraction,
}: Readonly<PropertyCardProps>): ReactElement {
  const metadata = readPropertyCardMetadata(item);
  const primaryMedia = item.content.media[0];

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/10] bg-muted">
        {primaryMedia ? (
          <MediaRenderer
            alt={primaryMedia.alt}
            className="size-full"
            mediaClassName="size-full"
            source={{ url: primaryMedia.url }}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            No media
          </div>
        )}
      </div>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold tracking-normal">{metadata.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{metadata.locationLabel}</p>
          </div>
          <Badge className="shrink-0" variant="secondary">
            {metadata.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{metadata.priceLabel}</span>
          <span>{formatDate(item.content.createdAt)}</span>
          <span>{metadata.views} views</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {metadata.description}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-md border bg-muted/40 p-3 text-center">
          <Metric label="Likes" value={item.content.engagement.likes} />
          <Metric label="Saves" value={item.content.engagement.saves} />
          <Metric label="Shares" value={item.content.engagement.shares} />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        {(['like', 'save', 'share'] as const).map((interaction) => (
          <Button
            disabled={isInteracting}
            key={interaction}
            onClick={() => onInteraction(interaction, metadata.propertyId)}
            size="sm"
            variant={interaction === 'share' ? 'secondary' : 'outline'}
          >
            {interactionLabels[interaction]}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}

function Metric({ label, value }: Readonly<PropertyMetricProps>): ReactElement {
  return (
    <div>
      <p className="text-base font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
