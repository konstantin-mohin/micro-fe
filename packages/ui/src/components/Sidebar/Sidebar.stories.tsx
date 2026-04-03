import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    items: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Profile', href: '/profile' },
      { id: '3', label: 'Settings', children: [
          { id: '3-1', label: 'Account', href: '/settings/account' },
          { id: '3-2', label: 'Billing', href: '/settings/billing' },
          { id: '3-3', label: 'Notifications', href: '/settings/notifications' },
        ] 
      },
      { id: '4', label: 'React Query', href: '/react-query' },
      { id: '5', label: 'Modern React', children: [
          { id: '5-1', label: 'Server Components', href: '/rsc' },
          { id: '5-2', label: 'Actions', href: '/rsc/actions' },
          { id: '5-3', label: 'Transitions', href: '/rsc/transitions' }
        ]
      },
    ],
  },
};
