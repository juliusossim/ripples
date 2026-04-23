import type { ComponentPropsWithoutRef } from 'react';

export type EmptyMediaVariant = 'default' | 'icon';

export type EmptyProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type EmptyHeaderProps = Readonly<ComponentPropsWithoutRef<'div'>>;

export type EmptyMediaProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    variant?: EmptyMediaVariant;
  }
>;

export type EmptyTitleProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type EmptyDescriptionProps = Readonly<ComponentPropsWithoutRef<'p'>>;
export type EmptyContentProps = Readonly<ComponentPropsWithoutRef<'div'>>;
