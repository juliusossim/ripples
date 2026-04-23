import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Typography } from './Typography';

const meta = {
  component: Typography,
  title: 'content',
} satisfies Meta<typeof Typography>;
export default meta;

type Story = StoryObj<typeof Typography>;

export const Primary = {
  args: {
    children: 'content',
  },
} satisfies Story;

export const Heading = {
  args: {
    children: 'content',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/content/gi)).toBeTruthy();
  },
} satisfies Story;
