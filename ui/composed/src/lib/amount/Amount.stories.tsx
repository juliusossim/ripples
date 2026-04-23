import type { Meta, StoryObj } from '@storybook/react-vite';
import { Amount } from './Amount';
import { expect } from 'storybook/test';

const meta = {
  component: Amount,
  title: 'Amount',
} satisfies Meta<typeof Amount>;
export default meta;

type Story = StoryObj<typeof Amount>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Amount/gi)).toBeTruthy();
  },
} satisfies Story;
