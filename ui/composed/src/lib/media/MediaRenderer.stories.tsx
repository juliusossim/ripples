import type { Meta, StoryObj } from '@storybook/react-vite';
import { MediaRenderer } from './MediaRenderer';
import { expect } from 'storybook/test';

const meta = {
  component: MediaRenderer,
  title: 'MediaRenderer',
} satisfies Meta<typeof MediaRenderer>;
export default meta;

type Story = StoryObj<typeof MediaRenderer>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/MediaRenderer/gi)).toBeTruthy();
  },
} satisfies Story;
