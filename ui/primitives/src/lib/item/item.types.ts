import type { ComponentPropsWithoutRef } from 'react';
import type { SeparatorProps } from '../separator';

export type ItemVariant = 'default' | 'outline' | 'muted';
export type ItemSize = 'default' | 'sm';
export type ItemMediaVariant = 'default' | 'icon' | 'image';

export type ItemGroupProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type ItemSeparatorProps = Readonly<SeparatorProps>;

export type ItemProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    variant?: ItemVariant;
    size?: ItemSize;
    asChild?: boolean;
  }
>;

export type ItemMediaProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    variant?: ItemMediaVariant;
  }
>;

export type ItemContentProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type ItemTitleProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type ItemDescriptionProps = Readonly<ComponentPropsWithoutRef<'p'>>;
export type ItemActionsProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type ItemHeaderProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type ItemFooterProps = Readonly<ComponentPropsWithoutRef<'div'>>;
