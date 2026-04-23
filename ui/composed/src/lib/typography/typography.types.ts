import type { CSSProperties, ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { TooltipContentProps } from '@org/ui-primitives';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'label';

export type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';
export type TypographyColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'warning'
  | 'error'
  | 'inherit';

export type TypographyOwnProps = Readonly<{
  variant?: TypographyVariant;
  as?: ElementType;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  color?: TypographyColor;
  truncate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
  noWrap?: boolean;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}>;

export type TypographyProps = TypographyOwnProps &
  Readonly<Omit<ComponentPropsWithoutRef<'p'>, keyof TypographyOwnProps | 'color'>>;

export type TypographyVariantProps = Readonly<Omit<TypographyProps, 'variant'>>;

export type TruncatedTextProps = Readonly<
  Omit<TypographyProps, 'children'> & {
    text: string;
    maxWidth?: string | number;
    showTooltip?: boolean;
    tooltipSide?: TooltipContentProps['side'];
  }
>;

export type MoreInfoTextProps = Readonly<{
  title: ReactNode;
  content?: ReactNode;
  children?: ReactNode;
  className?: string;
  open?: boolean;
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}>;
