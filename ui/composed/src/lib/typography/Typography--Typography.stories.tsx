import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: Typography,
  title: 'Typography',
} satisfies Meta<typeof Typography>;
export default meta;

type Story = StoryObj<typeof Typography>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Typography/gi)).toBeTruthy();
  },
} satisfies Story;
