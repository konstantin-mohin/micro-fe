import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Content Area</h2>
        <p className="text-gray-600">
          This is where the main content of the application goes.
        </p>
      </div>
    ),
    title: 'Dashboard Layout',
  },
};
