import { type BrandBadgeProps } from '@org/models';
import { Caption, MoreInfoText, SmallText, Typography } from '../..';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '../utils';

export function BrandBadge({
  brand,
  variant,
  onClick,
  onKeyDown,
  clickable,
}: Readonly<BrandBadgeProps>) {
  const title = brand.href ? (
    <a href={brand.href}>{brand.name}</a>
  ) : (
    <Caption className={brand.className}>{brand.name}</Caption>
  );

  const displayTitle = brand.description ? (
    <MoreInfoText content={brand.description} title={title}>
      <SmallText className="text-indigo-400 text-xs">
        {brand.description}
      </SmallText>
    </MoreInfoText>
  ) : (
    title
  );

  const content = (
    <>
      {brand.logo && (
        <Avatar>
          <AvatarImage src={brand.logo} alt={brand.name} />
          <AvatarFallback>Logo</AvatarFallback>
        </Avatar>
      )}
      <Typography className="flex items-center gap-1">
        {brand.icon && brand.iconPosition === 'start' && brand.icon}
        {displayTitle}
        {brand.icon && brand.iconPosition === 'end' && brand.icon}
      </Typography>
    </>
  );

  // Otherwise render as interactive badge if clickable
  return (
    <Badge
      variant={variant}
      className={cn(
        ' py-1.5 text-sm transition-transform',
        (clickable || brand.href) && 'cursor-pointer hover:scale-105'
      )}
      onClick={clickable ? () => onClick(brand) : undefined}
      onKeyDown={clickable ? (e) => onKeyDown(e, brand) : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
    >
      {content}
    </Badge>
  );
}
export default BrandBadge;
