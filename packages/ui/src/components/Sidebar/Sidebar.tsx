import React from 'react';
import { SidebarMenu, type SidebarMenuItem } from '../SidebarMenu';

export interface SidebarProps {
  items?: SidebarMenuItem[];
  className?: string;
}

export function Sidebar({
  items = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Profile', href: '/profile' },
    { id: '3', label: 'React Query', href: '/react-query' },
    { id: '4', label: 'Modern React', children: [
        { id: '4-1', label: 'Server Components', href: '/rsc' },
        { id: '4-2', label: 'Actions', href: '/rsc/actions' },
        { id: '4-3', label: 'Transitions', href: '/rsc/transitions' }
      ]
    },
    { id: '5', label: 'Design System', href: '/design-system/', target: '_blank', isExternal: true },
  ],
  className
}: SidebarProps) {
  return (
    <aside className={`w-64 bg-gray-50 dark:bg-gray-800 h-screen p-4 border-r border-gray-200 dark:border-gray-700 ${className || ''}`}>
      <SidebarMenu items={items} />
    </aside>
  );
}
