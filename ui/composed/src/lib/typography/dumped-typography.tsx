import { Tooltip, TooltipContent, TooltipTrigger, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import {
  alignStyles,
  colorStyles,
  lineClampStyles,
  variantElements,
  variantStyles,
  weightStyles,
} from './typography.constants';
import type {
  TruncatedTextProps,
  TypographyProps,
  TypographyVariantProps,
} from './typography.types';

export function Typography({
  variant = 'body1',
  as,
  weight,
  align,
  color = 'default',
  truncate = false,
  lineClamp,
  noWrap = false,
  className,
  children,
  ...props
}: Readonly<TypographyProps>): ReactElement {
  const Component = as ?? variantElements[variant];

  return (
    <Component
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weight ? weightStyles[weight] : null,
        align ? alignStyles[align] : null,
        truncate ? 'truncate' : null,
        lineClamp ? lineClampStyles[lineClamp] : null,
        noWrap ? 'whitespace-nowrap' : null,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function H1(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="h1" {...props} />;
}

export function H2(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="h2" {...props} />;
}

export function H3(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="h3" {...props} />;
}

export function H4(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="h4" {...props} />;
}

export function Text(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="body1" {...props} />;
}

export function SmallText(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="body2" {...props} />;
}

export function Caption(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="caption" {...props} />;
}

export function Label(props: Readonly<TypographyVariantProps>): ReactElement {
  return <Typography variant="label" {...props} />;
}

export function TruncatedText({
  text,
  maxWidth,
  className,
  lineClamp,
  showTooltip = true,
  tooltipSide = 'top',
  ...props
}: Readonly<TruncatedTextProps>): ReactElement {
  const content = (
    <Typography
      {...props}
      className={cn('cursor-default', className)}
      lineClamp={lineClamp}
      style={{ maxWidth, ...props.style }}
      truncate={!lineClamp}
    >
      {text}
    </Typography>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent className="max-w-xs" side={tooltipSide}>
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
