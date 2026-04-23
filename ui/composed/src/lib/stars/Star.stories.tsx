import type { Meta, StoryObj } from '@storybook/react-vite';
import { StarRating } from './Star';
import { expect } from 'storybook/test';

const meta = {
  component: StarRating,
  title: 'StarRating',
} satisfies Meta<typeof StarRating>;
export default meta;

type Story = StoryObj<typeof StarRating>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/StarRating/gi)).toBeTruthy();
  },
} satisfies Story;
