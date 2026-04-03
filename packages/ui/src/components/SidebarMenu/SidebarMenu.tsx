import React from 'react';
import { Disclosure, DisclosurePanel, Button, Link } from 'react-aria-components';

export interface SidebarMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: SidebarMenuItem[];
}

export interface SidebarMenuProps {
  items: SidebarMenuItem[];
  className?: string;
}

export function SidebarMenu({ items, className }: SidebarMenuProps) {
  return (
    <nav>
      <ul className={`space-y-2 ${className || ''}`}>
        {items.map(item => (
          <SidebarMenuItemComponent key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
}

function SidebarMenuItemComponent({ item, depth = 0 }: { item: SidebarMenuItem, depth?: number }) {
  const paddingLeft = `${(depth + 1) * 1}rem`;

  if (item.children && item.children.length > 0) {
    return (
      <li>
        <Disclosure>
          {({ isExpanded }) => (
            <>
              <Button
                slot="trigger"
                className={({ isHovered, isFocused }) => `
                  w-full flex items-center justify-between px-4 py-2 rounded transition-colors cursor-pointer outline-none
                  ${isHovered ? 'bg-gray-200 dark:bg-gray-700' : ''}
                  ${isFocused ? 'outline outline-2 outline-blue-300' : ''}
                  text-gray-700 dark:text-gray-200
                `}
                style={{ paddingLeft }}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              <DisclosurePanel>
                <ul className="mt-1 space-y-1">
                  {item.children!.map(child => (
                    <SidebarMenuItemComponent key={child.id} item={child} depth={depth + 1} />
                  ))}
                </ul>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        className={({ isPressed, isFocused, isHovered }) => `
          block px-4 py-2 rounded transition-colors cursor-pointer outline-none
          ${isHovered ? 'bg-gray-200 dark:bg-gray-700' : ''}
          ${isPressed ? 'bg-gray-300 dark:bg-gray-600' : ''}
          ${isFocused ? 'outline outline-2 outline-blue-300' : ''}
          text-gray-700 dark:text-gray-200
        `}
        style={{ paddingLeft }}
      >
        <span className="flex items-center gap-2">
          {item.icon}
          {item.label}
        </span>
      </Link>
    </li>
  );
}
