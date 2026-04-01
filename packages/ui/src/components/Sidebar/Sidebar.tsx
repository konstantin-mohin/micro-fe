import React from 'react';
import { Link } from 'react-aria-components';

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
}

export interface SidebarProps {
  items?: SidebarItem[];
  className?: string;
}

export function Sidebar({
  items = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Profile', href: '/profile' },
    { id: '3', label: 'React Query', href: '/react-query' },
    { id: '4', label: 'Server Components', href: '/rsc' },
  ],
  className
}: SidebarProps) {
  return (
    <aside className={`w-64 bg-gray-50 dark:bg-gray-800 h-screen p-4 border-r border-gray-200 dark:border-gray-700 ${className || ''}`}>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={({ isPressed, isFocused, isHovered }) => `
                  block px-4 py-2 rounded transition-colors
                  ${isHovered ? 'bg-gray-200 dark:bg-gray-700' : ''}
                  ${isPressed ? 'bg-gray-300 dark:bg-gray-600' : ''}
                  ${isFocused ? 'outline outline-2 outline-blue-300' : ''}
                  text-gray-700 dark:text-gray-200
                `}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
