import type { Meta, StoryObj } from '@storybook/react-vite';
import { H4 } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: H4,
  title: 'H4',
} satisfies Meta<typeof H4>;
export default meta;

type Story = StoryObj<typeof H4>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/H4/gi)).toBeTruthy();
  },
} satisfies Story;
