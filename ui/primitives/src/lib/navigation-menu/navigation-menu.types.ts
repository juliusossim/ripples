import type * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import type { ComponentPropsWithoutRef } from 'react';

export type NavigationMenuProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean;
  }
>;

export type NavigationMenuListProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>;

export type NavigationMenuItemProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>;

export type NavigationMenuTriggerProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>;

export type NavigationMenuContentProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>;

export type NavigationMenuViewportProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>;

export type NavigationMenuLinkProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>;

export type NavigationMenuIndicatorProps = Readonly<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>;
