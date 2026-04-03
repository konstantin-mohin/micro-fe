import type { Meta, StoryObj } from '@storybook/react';
import { SidebarMenu } from './SidebarMenu';

const meta: Meta<typeof SidebarMenu> = {
  title: 'Components/SidebarMenu',
  component: SidebarMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidebarMenu>;

export const Default: Story = {
  args: {
    items: [
      { id: '1', label: 'Dashboard', href: '/' },
      { id: '2', label: 'External Site', href: 'https://google.com', target: '_blank', isExternal: true },
      { id: '3', label: 'Settings', children: [
          { id: '3-1', label: 'Account', href: '/account' },
          { id: '3-2', label: 'Billing', href: '/billing' },
        ] 
      },
    ],
  },
};
