'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface NavItemProps {
  id: string;
  name: string | React.ReactNode;
  href?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface NavigationMenuProps {
  items: NavItemProps[];
}

export function NavMenuWrapper({ items }: Readonly<NavigationMenuProps>) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.id}>
            {item.href ? (
              <NavigationMenuLink asChild>
                <Link to={item.href}>
                  {typeof item.name === 'string' ? (
                    <div className="flex gap-2 items-center">
                      {item.icon}
                      {item.name}
                    </div>
                  ) : (
                    item.name
                  )}
                </Link>
              </NavigationMenuLink>
            ) : (
              <NavigationMenuTrigger className="bg-transparent">
                {typeof item.name === 'string' ? (
                  <div className="flex gap-2 items-center">
                    {item.icon}
                    {item.name}
                  </div>
                ) : (
                  item.name
                )}
              </NavigationMenuTrigger>
            )}
            {item.children ? (
              <NavigationMenuContent>{item.children}</NavigationMenuContent>
            ) : null}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
