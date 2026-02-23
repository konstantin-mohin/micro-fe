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
      { id: '3', label: 'React Query', href: '/react-query' },
      { id: '4', label: 'Settings', href: '/settings' },
    ],
  },
};
