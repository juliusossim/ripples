import { Avatar, AvatarFallback, AvatarImage, Badge, cn } from '@org/ui-primitives';
import type { KeyboardEvent, ReactElement } from 'react';
import { MoreInfoText, Caption, Typography } from '../../typography';
import type { BrandBadgeProps } from './brand-badge.types';

function handleKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  props: Readonly<BrandBadgeProps>,
): void {
  if (!props.clickable) {
    return;
  }

  props.onKeyDown?.(event, props.brand);

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    props.onClick?.(props.brand);
  }
}

export function BrandBadge({
  brand,
  variant = 'secondary',
  clickable = false,
  onClick,
  onKeyDown,
}: Readonly<BrandBadgeProps>): ReactElement {
  const title = brand.href ? (
    <a href={brand.href}>{brand.name}</a>
  ) : (
    <Caption className={brand.className}>{brand.name}</Caption>
  );

  const displayTitle = brand.description ? (
    <MoreInfoText content={brand.description} title={title}>
      <span className="text-xs text-sky-400">{brand.description}</span>
    </MoreInfoText>
  ) : (
    title
  );

  return (
    <Badge
      className={cn(
        'py-1.5 text-sm transition-transform',
        clickable || brand.href ? 'cursor-pointer hover:scale-105' : '',
      )}
      onClick={clickable ? () => onClick?.(brand) : undefined}
      onKeyDown={(event) => handleKeyDown(event, { brand, variant, clickable, onClick, onKeyDown })}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      variant={variant}
    >
      {brand.logoUrl ? (
        <Avatar className="mr-2" size="sm">
          <AvatarImage alt={brand.name} src={brand.logoUrl} />
          <AvatarFallback>{brand.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : null}
      <Typography className="flex items-center gap-1">
        {brand.icon && brand.iconPosition === 'start' ? brand.icon : null}
        {displayTitle}
        {brand.icon && brand.iconPosition === 'end' ? brand.icon : null}
      </Typography>
    </Badge>
  );
}
