import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { NavRenderLinkProps } from '../nav-menu';

export type NavListItemProps = Readonly<
  ComponentPropsWithoutRef<'li'> & {
    href: string;
    title: ReactNode;
    icon?: ReactNode;
    children?: ReactNode;
    renderLink?: (props: NavRenderLinkProps) => ReactNode;
  }
>;
