import { Item, ItemContent, ItemMedia, ItemTitle, Spinner } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { LoadingSpinnerProps } from './loading-spinner.types';

export function LoadingSpinner({
  title = 'Loading',
  message = 'Please wait while content loads.',
  imageUrl,
}: Readonly<LoadingSpinnerProps>): ReactElement {
  return (
    <Item className="max-h-dvw max-w-2xl flex-col gap-4 [--radius:1rem]" variant="muted">
      <ItemContent>
        <ItemTitle className="line-clamp-1">{title}</ItemTitle>
      </ItemContent>
      {imageUrl ? (
        <ItemMedia className="h-48 max-w-2xs overflow-hidden rounded-lg">
          <img alt="" src={imageUrl} />
        </ItemMedia>
      ) : null}
      <ItemContent className="flex flex-row items-center justify-between gap-4">
        <p className="text-sm">{message}</p>
        <ItemMedia>
          <Spinner />
        </ItemMedia>
      </ItemContent>
    </Item>
  );
}
