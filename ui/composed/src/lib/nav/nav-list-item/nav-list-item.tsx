import { NavigationMenuLink, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { NavListItemProps } from './nav-list-item.types';

function renderLink(
  href: string,
  renderLinkProp: NavListItemProps['renderLink'],
  className: string | undefined,
  children: NavListItemProps['children'] | ReactElement,
): ReactElement {
  if (renderLinkProp) {
    return renderLinkProp({ href, children, className }) as ReactElement;
  }

  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

export function NavListItem({
  title,
  children,
  href,
  icon,
  renderLink: renderLinkProp,
  className,
  ...props
}: Readonly<NavListItemProps>): ReactElement {
  return (
    <li className={className} {...props}>
      <NavigationMenuLink asChild>
        {renderLink(
          href,
          renderLinkProp,
          undefined,
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-1 font-medium leading-none">
              {icon}
              {title}
            </div>
            {children ? (
              <div className={cn('line-clamp-2 text-muted-foreground')}>{children}</div>
            ) : null}
          </div>,
        )}
      </NavigationMenuLink>
    </li>
  );
}
