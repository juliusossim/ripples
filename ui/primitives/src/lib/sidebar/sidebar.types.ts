import type { ComponentPropsWithoutRef } from 'react';
import type { ButtonProps } from '../button';
import type { InputProps } from '../input';
import type { SeparatorProps } from '../separator';
import type { TooltipContentProps } from '../tooltip';

export type SidebarState = 'expanded' | 'collapsed';
export type SidebarSide = 'left' | 'right';
export type SidebarVariant = 'sidebar' | 'floating' | 'inset';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';
export type SidebarMenuButtonVariant = 'default' | 'outline';
export type SidebarMenuButtonSize = 'default' | 'sm' | 'lg';
export type SidebarMenuSubButtonSize = 'sm' | 'md';

export type SidebarContextProps = Readonly<{
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}>;

export type SidebarProviderProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>;

export type SidebarProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    side?: SidebarSide;
    variant?: SidebarVariant;
    collapsible?: SidebarCollapsible;
  }
>;

export type SidebarTriggerProps = Readonly<ButtonProps>;
export type SidebarRailProps = Readonly<ComponentPropsWithoutRef<'button'>>;
export type SidebarInsetProps = Readonly<ComponentPropsWithoutRef<'main'>>;
export type SidebarInputProps = Readonly<InputProps>;
export type SidebarHeaderProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type SidebarFooterProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type SidebarSeparatorProps = Readonly<SeparatorProps>;
export type SidebarContentProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type SidebarGroupProps = Readonly<ComponentPropsWithoutRef<'div'>>;

export type SidebarGroupLabelProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    asChild?: boolean;
  }
>;

export type SidebarGroupActionProps = Readonly<
  ComponentPropsWithoutRef<'button'> & {
    asChild?: boolean;
  }
>;

export type SidebarGroupContentProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type SidebarMenuProps = Readonly<ComponentPropsWithoutRef<'ul'>>;
export type SidebarMenuItemProps = Readonly<ComponentPropsWithoutRef<'li'>>;

export type SidebarMenuButtonProps = Readonly<
  ComponentPropsWithoutRef<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    variant?: SidebarMenuButtonVariant;
    size?: SidebarMenuButtonSize;
    tooltip?: string | TooltipContentProps;
  }
>;

export type SidebarMenuActionProps = Readonly<
  ComponentPropsWithoutRef<'button'> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>;

export type SidebarMenuBadgeProps = Readonly<ComponentPropsWithoutRef<'div'>>;

export type SidebarMenuSkeletonProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    showIcon?: boolean;
  }
>;

export type SidebarMenuSubProps = Readonly<ComponentPropsWithoutRef<'ul'>>;
export type SidebarMenuSubItemProps = Readonly<ComponentPropsWithoutRef<'li'>>;

export type SidebarMenuSubButtonProps = Readonly<
  ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
    size?: SidebarMenuSubButtonSize;
    isActive?: boolean;
  }
>;
