import type { ReactNode } from 'react';

export type NavRenderLinkProps = Readonly<{
  href: string;
  children: ReactNode;
  className?: string;
}>;

export type NavItem = Readonly<{
  id: string;
  name: string | ReactNode;
  href?: string;
  children?: ReactNode;
  icon?: ReactNode;
  active?: boolean;
}>;

export type NavMenuProps = Readonly<{
  items: readonly NavItem[];
  renderLink?: (props: NavRenderLinkProps) => ReactNode;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
}>;
