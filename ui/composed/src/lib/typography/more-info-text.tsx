import { HoverCard, HoverCardContent, HoverCardTrigger } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { MoreInfoTextProps } from './typography.types';

export function MoreInfoText({
  title,
  content,
  children,
  className,
  open,
  openDelay = 10,
  closeDelay = 100,
  onOpenChange,
}: Readonly<MoreInfoTextProps>): ReactElement {
  return (
    <HoverCard
      closeDelay={closeDelay}
      onOpenChange={onOpenChange}
      open={open}
      openDelay={openDelay}
    >
      <HoverCardTrigger asChild>{title}</HoverCardTrigger>
      <HoverCardContent className={className}>{children ?? content}</HoverCardContent>
    </HoverCard>
  );
}
